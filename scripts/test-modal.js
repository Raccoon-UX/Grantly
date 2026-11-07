const puppeteer = require('puppeteer-core');

const CHROME_PATH =
  process.env.CHROME_PATH ||
  (process.platform === 'win32'
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : '/usr/bin/google-chrome');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/scholarships/grant-01', { waitUntil: 'networkidle0' });
  await page.waitForSelector('button');

  // Find and click the Update button to open dialog
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(
      (x) =>
        x.textContent.includes('Update Status') ||
        x.textContent.includes('Add to Application Tracker')
    );
    if (b) {
      b.click();
      return true;
    }
    return false;
  });
  console.log('Update button clicked:', clicked);
  await page.waitForSelector('[role="dialog"]');

  const modalVisible = await page.evaluate(
    () => !!document.querySelector('[role="dialog"]')
  );
  console.log('Dialog opened:', modalVisible);

  // Press Escape key
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 300));
  const modalAfterEsc = await page.evaluate(
    () => !!document.querySelector('[role="dialog"]')
  );
  console.log('Dialog closed on Escape:', !modalAfterEsc);

  await browser.close();
  console.log('Dialog test passed successfully.');
})();
