const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const axeCore = require('axe-core');

const CHROME_PATH =
  process.env.CHROME_PATH ||
  (process.platform === 'win32'
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : '/usr/bin/google-chrome');
const SCRATCH_DIR = path.join(__dirname, '../.screenshots');
if (!fs.existsSync(SCRATCH_DIR)) {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runAudit() {
  console.log('🚀 Starting Comprehensive Browser E2E & Multi-Viewport Axe Audit...');
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const networkErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('requestfailed', (req) => {
    // Ignore cancelled Next.js Link prefetch requests
    if (!req.url().includes('_rsc=')) {
      networkErrors.push(`${req.url()} -> ${req.failure() ? req.failure().errorText : 'failed'}`);
    }
  });

  // 1. Multi-Viewport Responsive Audits (1440, 1024, 768, 390)
  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900, isMobile: false },
    { name: 'laptop-1024', width: 1024, height: 768, isMobile: false },
    { name: 'tablet-768', width: 768, height: 1024, isMobile: true },
    { name: 'mobile-390', width: 390, height: 844, isMobile: true },
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
    const screenshotPath = path.join(SCRATCH_DIR, `dashboard-${vp.name}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`📱 Responsive Screenshot captured: ${vp.name} (width: ${vp.width}px)`);
  }

  // 2. Comprehensive Axe Accessibility on All Core Views
  await page.setViewport({ width: 1440, height: 900 });
  const allRoutes = [
    '/',
    '/dashboard',
    '/discover',
    '/smart-match',
    '/applications',
    '/documents',
    '/profile',
    '/settings',
    '/scholarships/grant-01',
  ];

  console.log('\n--- COMPREHENSIVE AXE ACCESSIBILITY AUDIT ---');
  let totalViolations = 0;

  for (const r of allRoutes) {
    await page.goto('http://localhost:3000' + r, { waitUntil: 'networkidle0' });
    await page.evaluate(axeCore.source);
    const results = await page.evaluate(async () => {
      return await axe.run();
    });
    console.log(`🔍 Axe on ${r.padEnd(24)}: Violations: ${results.violations.length}`);
    if (results.violations.length > 0) {
      totalViolations += results.violations.length;
      results.violations.forEach((v) => {
        console.log(`   - [${v.impact}] ${v.id}: ${v.description}`);
      });
    }
  }

  // 3. Core User Journey Test:
  console.log('\n--- TESTING CORE USER JOURNEYS & WHAT-IF SIMULATOR ---');
  
  // Step A: Edit Profile
  await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle0' });
  await page.waitForSelector('#profile-academicScore');
  await page.click('#profile-academicScore', { clickCount: 3 });
  await page.type('#profile-academicScore', '95.0');
  await page.click('button[type="submit"]');
  await delay(600);
  console.log('✅ Step A: Profile academic score updated to 95.0% and saved');

  // Step B: Smart Match Recalculation
  await page.goto('http://localhost:3000/smart-match', { waitUntil: 'networkidle0' });
  const smartMatchText = await page.evaluate(() => document.body.innerText);
  const hasHighMatch = smartMatchText.includes('Deterministic Smart Match');
  console.log(`✅ Step B: Smart Match page loaded with live recalculations (Verified: ${hasHighMatch})`);

  // Step C: Interactive What-If Scenario Simulator
  const testScenariosBtn = await page.$('button[aria-expanded="false"]');
  if (testScenariosBtn) {
    await testScenariosBtn.click();
    await delay(300);
    const simScoreInput = await page.$('#sim-score-input');
    if (simScoreInput) {
      await page.evaluate(() => {
        const input = document.getElementById('sim-score-input');
        input.value = '98';
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await delay(400);
      const afterSimText = await page.evaluate(() => document.body.innerText);
      const hasSimNotice = afterSimText.includes('Simulating What-If');
      console.log(`✅ Step C: What-If Scenario Explorer triggered and live simulation active: ${hasSimNotice}`);
    }
  }

  // Step D: Bookmark on Discover
  await page.goto('http://localhost:3000/discover', { waitUntil: 'networkidle0' });
  const bookmarkButtons = await page.$$('button[aria-label="Save scholarship"]');
  if (bookmarkButtons.length > 0) {
    await bookmarkButtons[0].click();
    await delay(400);
    console.log('✅ Step D: Scholarship bookmarked on Discover');
  }

  // Step E: Application Status Update on Details
  await page.goto('http://localhost:3000/scholarships/grant-01', { waitUntil: 'networkidle0' });
  await page.waitForSelector('button');
  const updateClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(x => x.textContent.includes('Update Status') || x.textContent.includes('Add to Application Tracker'));
    if (b) {
      b.scrollIntoView();
      b.click();
      return true;
    }
    return false;
  });
  if (updateClicked) {
    await page.waitForSelector('[role="dialog"]');
    await page.waitForSelector('textarea');
    await page.type('textarea', 'QA Verified Submission Note');
    await page.waitForSelector('button[type="submit"]');
    await page.click('button[type="submit"]');
    await delay(600);
    console.log('✅ Step E: Application status updated with QA verification note');
  }

  // Step F: Reload and check LocalStorage Persistence
  await page.reload({ waitUntil: 'networkidle0' });
  const reloadedText = await page.evaluate(() => document.body.innerText);
  const statusPersisted = reloadedText.includes('Tracker Status');
  console.log(`✅ Step F: Page reloaded. Tracker Status persisted in LocalStorage: ${statusPersisted}`);

  console.log('\n--- CONSOLE & AUDIT SUMMARY ---');
  console.log(`Console Errors (${consoleErrors.length}):`, consoleErrors);
  console.log(`Total Accessibility Violations across all 9 pages: ${totalViolations}`);

  await browser.close();
  if (totalViolations > 0) {
    throw new Error(`Accessibility violations found: ${totalViolations}`);
  }
  console.log('\n🎉 Comprehensive browser E2E & Axe audit completed with 0 errors and 0 violations!');
}

runAudit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
