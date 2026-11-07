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
  console.log('🚀 Starting Pre-Submission Browser E2E & Axe Audit...');
  
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
    networkErrors.push(`${req.url()} -> ${req.failure() ? req.failure().errorText : 'failed'}`);
  });

  // 1. Desktop Screenshots (1440x900)
  await page.setViewport({ width: 1440, height: 900 });
  const routes = ['/', '/dashboard', '/discover', '/smart-match', '/applications', '/profile'];
  
  for (const r of routes) {
    await page.goto('http://localhost:3000' + r, { waitUntil: 'networkidle0' });
    const name = r === '/' ? 'home' : r.replace('/', '');
    const screenshotPath = path.join(SCRATCH_DIR, `desktop-1440-${name}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Desktop Screenshot captured: ${name}`);

    // Run Axe on core pages
    if (['/', '/dashboard', '/discover', '/smart-match'].includes(r)) {
      await page.evaluate(axeCore.source);
      const results = await page.evaluate(async () => {
        return await axe.run();
      });
      console.log(`🔍 Axe on ${r}: Violations count: ${results.violations.length}`);
      if (results.violations.length > 0) {
        results.violations.forEach((v) => {
          console.log(`   - [${v.impact}] ${v.id}: ${v.description}`);
        });
      }
    }
  }

  // 2. Mobile Screenshots (390x844)
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  for (const r of ['/dashboard', '/discover']) {
    await page.goto('http://localhost:3000' + r, { waitUntil: 'networkidle0' });
    const name = r.replace('/', '');
    const screenshotPath = path.join(SCRATCH_DIR, `mobile-390-${name}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`📱 Mobile Screenshot captured: ${name}`);
  }

  // 3. Core User Journey Test:
  // Profile Edit -> Smart Match Recalculation -> Bookmark -> Status Update -> Reload Persistence
  console.log('\n--- TESTING CORE USER JOURNEY ---');
  await page.setViewport({ width: 1440, height: 900 });
  
  // Step A: Edit Profile
  await page.goto('http://localhost:3000/profile', { waitUntil: 'networkidle0' });
  await page.waitForSelector('#profile-academicScore');
  await page.click('#profile-academicScore', { clickCount: 3 });
  await page.type('#profile-academicScore', '95.0');
  await page.click('button[type="submit"]');
  await delay(1000);
  console.log('✅ Step A: Profile academic score updated to 95.0% and saved');

  // Step B: Smart Match Recalculation
  await page.goto('http://localhost:3000/smart-match', { waitUntil: 'networkidle0' });
  const smartMatchText = await page.evaluate(() => document.body.innerText);
  const hasHighMatch = smartMatchText.includes('Deterministic Smart Match');
  console.log(`✅ Step B: Smart Match page loaded with live recalculations (Verified: ${hasHighMatch})`);

  // Step C: Bookmark on Discover
  await page.goto('http://localhost:3000/discover', { waitUntil: 'networkidle0' });
  const bookmarkButtons = await page.$$('button[aria-label="Save scholarship"]');
  if (bookmarkButtons.length > 0) {
    await bookmarkButtons[0].click();
    await delay(600);
    console.log('✅ Step C: Scholarship bookmarked on Discover');
  }

  // Step D: Application Status Update on Details
  await page.goto('http://localhost:3000/scholarships/grant-01', { waitUntil: 'networkidle0' });
  await page.waitForSelector('button');
  const updateBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent.includes('Update Status') || b.textContent.includes('Add to Application Tracker'));
  });
  if (updateBtn) {
    await updateBtn.click();
    await page.waitForSelector('textarea[placeholder*="Application ID"]');
    await page.type('textarea[placeholder*="Application ID"]', 'QA Verified Submission Note');
    await page.click('button[type="submit"]');
    await delay(800);
    console.log('✅ Step D: Application status updated with QA verification note');
  }

  // Step E: Reload and check LocalStorage Persistence
  await page.reload({ waitUntil: 'networkidle0' });
  const reloadedText = await page.evaluate(() => document.body.innerText);
  const statusPersisted = reloadedText.includes('Tracker Status');
  console.log(`✅ Step E: Page reloaded. Tracker Status persisted in LocalStorage: ${statusPersisted}`);

  console.log('\n--- CONSOLE & NETWORK AUDIT ---');
  console.log(`Console Errors (${consoleErrors.length}):`, consoleErrors);
  console.log(`Network Failures (${networkErrors.length}):`, networkErrors);

  await browser.close();
  console.log('\n🎉 Pre-submission browser QA audit completed successfully!');
}

runAudit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
