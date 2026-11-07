const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH =
  process.env.CHROME_PATH ||
  (process.platform === 'win32'
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : '/usr/bin/google-chrome');

async function traceRoute(browser, route, traceFile) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const client = await page.target().createCDPSession();
  // 4x CPU throttling
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.tracing.start({
    path: traceFile,
    screenshots: false,
    categories: ['devtools.timeline', 'v8.execute', 'blink.user_timing'],
  });

  await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  await page.tracing.stop();
  await page.close();

  // Analyze trace
  const rawData = JSON.parse(fs.readFileSync(traceFile, 'utf8'));
  const events = rawData.traceEvents || [];

  const longTasks = events.filter(
    (e) => e.name === 'RunTask' && e.dur && e.dur > 50000 // >50ms in microseconds
  );

  let totalBlockingTime = 0;
  for (const t of longTasks) {
    const durMs = t.dur / 1000;
    totalBlockingTime += durMs - 50;
  }

  const v8Calls = {};
  for (const e of events) {
    if (e.name === 'FunctionCall' || e.name === 'EvaluateScript') {
      const durMs = (e.dur || 0) / 1000;
      const key = e.name + (e.args?.data?.url ? ` (${path.basename(e.args.data.url)})` : '');
      v8Calls[key] = (v8Calls[key] || 0) + durMs;
    }
  }

  return {
    longTasksCount: longTasks.length,
    estimatedTbt: totalBlockingTime,
    topV8Calls: Object.entries(v8Calls)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
  };
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  console.log('Tracing /dashboard...');
  const dash = await traceRoute(browser, '/dashboard', 'dash_trace.json');
  console.log('Dashboard Analysis (4x CPU Throttling):');
  console.log(`  Long Tasks (>50ms): ${dash.longTasksCount}`);
  console.log(`  Estimated TBT: ${dash.estimatedTbt.toFixed(1)}ms`);
  console.log('  Top V8/Script Operations:');
  dash.topV8Calls.forEach(([k, v]) => console.log(`    - ${k}: ${v.toFixed(1)}ms`));

  console.log('\nTracing /smart-match...');
  const smart = await traceRoute(browser, '/smart-match', 'smart_trace.json');
  console.log('Smart Match Analysis (4x CPU Throttling):');
  console.log(`  Long Tasks (>50ms): ${smart.longTasksCount}`);
  console.log(`  Estimated TBT: ${smart.estimatedTbt.toFixed(1)}ms`);
  console.log('  Top V8/Script Operations:');
  smart.topV8Calls.forEach(([k, v]) => console.log(`    - ${k}: ${v.toFixed(1)}ms`));

  await browser.close();
}

main().catch(console.error);
