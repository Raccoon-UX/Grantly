const puppeteer = require('puppeteer-core');

const CHROME_PATH =
  process.env.CHROME_PATH ||
  (process.platform === 'win32'
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : '/usr/bin/google-chrome');

async function measurePage(page, url) {
  await page.goto('about:blank');
  
  // Set up performance observer in page before navigation
  await page.evaluateOnNewDocument(() => {
    window.__perfData = {
      lcp: 0,
      cls: 0,
      fcp: 0,
    };

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        window.__perfData.lcp = entry.startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__perfData.cls += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          window.__perfData.fcp = entry.startTime;
        }
      }
    }).observe({ type: 'paint', buffered: true });
  });

  await page.goto(url, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] || {};
    return {
      ttfb: nav.responseStart - nav.requestStart,
      domInteractive: nav.domInteractive,
      domContentLoaded: nav.domContentLoadedEventEnd,
      fcp: window.__perfData.fcp,
      lcp: window.__perfData.lcp,
      cls: window.__perfData.cls,
      resourcesCount: performance.getEntriesByType('resource').length,
      transferSize: performance.getEntriesByType('resource').reduce((acc, r) => acc + (r.transferSize || 0), 0),
    };
  });

  return metrics;
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const routes = ['/', '/dashboard', '/discover', '/smart-match', '/applications'];
  console.log('--- BASELINE PERFORMANCE AUDIT ---');
  for (const r of routes) {
    const m = await measurePage(page, `http://localhost:3000${r}`);
    console.log(`Route: ${r.padEnd(16)} | TTFB: ${m.ttfb.toFixed(1)}ms | FCP: ${m.fcp.toFixed(1)}ms | LCP: ${m.lcp.toFixed(1)}ms | CLS: ${m.cls.toFixed(4)} | Transfer: ${(m.transferSize / 1024).toFixed(1)} kB (${m.resourcesCount} reqs)`);
  }

  await browser.close();
}

run().catch(console.error);
