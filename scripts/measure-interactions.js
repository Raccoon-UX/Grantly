const puppeteer = require('puppeteer-core');

const CHROME_PATH =
  process.env.CHROME_PATH ||
  (process.platform === 'win32'
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : '/usr/bin/google-chrome');

async function testInteractions() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('--- REAL USER INTERACTION LATENCY (INP) AUDIT ---');

  // 1. Smart Match: Open Simulator
  await page.goto('http://localhost:3000/smart-match', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500));

  const t0 = performance.now();
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const simBtn = btns.find((b) => b.textContent.includes('Test Scenarios'));
    if (simBtn) simBtn.click();
  });
  await page.waitForSelector('#sim-score-input');
  const openSimLatency = performance.now() - t0;
  console.log(`[Smart Match] Toggle What-If Simulator: ${openSimLatency.toFixed(1)}ms`);

  // 2. Adjust slider value
  const t1 = performance.now();
  await page.evaluate(() => {
    const input = document.getElementById('sim-score-input');
    input.value = '95';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 100));
  const sliderLatency = performance.now() - t1;
  console.log(`[Smart Match] Adjust Slider & Re-calculate 14 matches: ${sliderLatency.toFixed(1)}ms`);

  // 3. Tab switch
  const t2 = performance.now();
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
    if (tabs[1]) tabs[1].click();
  });
  await new Promise((r) => setTimeout(r, 100));
  const tabLatency = performance.now() - t2;
  console.log(`[Smart Match] Switch Tab to High Match: ${tabLatency.toFixed(1)}ms`);

  // 4. Reset simulation
  const t3 = performance.now();
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const resetBtn = btns.find((b) => b.textContent.includes('Revert to Live Profile'));
    if (resetBtn) resetBtn.click();
  });
  await new Promise((r) => setTimeout(r, 100));
  const resetLatency = performance.now() - t3;
  console.log(`[Smart Match] Revert What-If Simulation: ${resetLatency.toFixed(1)}ms`);

  // 5. Dashboard Quick Search
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500));
  const t4 = performance.now();
  await page.type('#banner-search', 'Merit');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('button[type="submit"]'),
  ]);
  const searchNavLatency = performance.now() - t4;
  console.log(`[Dashboard] Quick Search to Discover: ${searchNavLatency.toFixed(1)}ms`);

  await browser.close();
}

testInteractions().catch(console.error);
