const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROUTES = ['/', '/dashboard', '/discover', '/smart-match'];
const RUNS = 3;
const COOLDOWN_MS = 3000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function runAudit(route) {
  const tmpFile = path.join(__dirname, '..', `lh_tmp_${Date.now()}.json`);
  const url = `http://localhost:3000${route}`;
  
  try {
    const cmd = `npx lighthouse "${url}" --output=json --output-path="${tmpFile}" --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage" --only-categories=performance,accessibility --quiet`;
    execSync(cmd, { stdio: 'ignore', timeout: 120000 });
    
    if (!fs.existsSync(tmpFile)) {
      throw new Error(`Output file ${tmpFile} not created`);
    }
    
    const data = JSON.parse(fs.readFileSync(tmpFile, 'utf8'));
    fs.unlinkSync(tmpFile);
    
    const perfScore = Math.round((data.categories.performance?.score || 0) * 100);
    const a11yScore = Math.round((data.categories.accessibility?.score || 0) * 100);
    const fcp = data.audits['first-contentful-paint']?.numericValue || 0;
    const lcp = data.audits['largest-contentful-paint']?.numericValue || 0;
    const tbt = data.audits['total-blocking-time']?.numericValue || 0;
    const cls = data.audits['cumulative-layout-shift']?.numericValue || 0;
    const ttfb = data.audits['server-response-time']?.numericValue || 0;
    
    return {
      perfScore,
      a11yScore,
      fcp,
      lcp,
      tbt,
      cls,
      ttfb,
    };
  } catch (err) {
    if (fs.existsSync(tmpFile)) {
      try { fs.unlinkSync(tmpFile); } catch {}
    }
    throw err;
  }
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function main() {
  console.log(`Starting Lighthouse 13.6 multi-run audit (${RUNS} runs per route with ${COOLDOWN_MS}ms cooldown)...`);
  const allResults = {};
  
  for (const route of ROUTES) {
    console.log(`\n================================`);
    console.log(`Auditing Route: ${route}`);
    console.log(`================================`);
    allResults[route] = [];
    
    for (let i = 1; i <= RUNS; i++) {
      console.log(`\nRun ${i}/${RUNS} for ${route}...`);
      await sleep(COOLDOWN_MS);
      const res = runAudit(route);
      allResults[route].push(res);
      console.log(`  -> Run ${i}: Perf: ${res.perfScore} | A11y: ${res.a11yScore} | FCP: ${res.fcp.toFixed(1)}ms | LCP: ${res.lcp.toFixed(1)}ms | TBT: ${res.tbt.toFixed(1)}ms | CLS: ${res.cls.toFixed(4)} | TTFB: ${res.ttfb.toFixed(1)}ms`);
    }
  }
  
  console.log(`\n\n======================================================`);
  console.log(`SUMMARY: MEDIAN LIGHTHOUSE 13.6 SCORES`);
  console.log(`======================================================`);
  console.log(`Route\t\tPerf\tA11y\tFCP\t\tLCP\t\tTBT\t\tCLS\tTTFB`);
  console.log(`------------------------------------------------------------------------------------------------`);
  
  for (const route of ROUTES) {
    const runs = allResults[route];
    const medPerf = median(runs.map(r => r.perfScore));
    const medA11y = median(runs.map(r => r.a11yScore));
    const medFcp = median(runs.map(r => r.fcp));
    const medLcp = median(runs.map(r => r.lcp));
    const medTbt = median(runs.map(r => r.tbt));
    const medCls = median(runs.map(r => r.cls));
    const medTtfb = median(runs.map(r => r.ttfb));
    
    console.log(`${route.padEnd(16)}\t${medPerf}\t${medA11y}\t${medFcp.toFixed(1)}ms\t${medLcp.toFixed(1)}ms\t${medTbt.toFixed(1)}ms\t${medCls.toFixed(4)}\t${medTtfb.toFixed(1)}ms`);
  }
}

main().catch(console.error);
