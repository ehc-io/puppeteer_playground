const puppeteer = require('puppeteer');

const targetUrl = 'http://books.toscrape.com/';
const cssBooksForPage = 'li.col-xs-6';
const cssBookLink =
  '#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a';

const scrape = async () => {
  console.log('Running...');
  console.log('Initiating browser session...');
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    // devtools: true,
    // userDataDir: './chromium-profile',
    args: [
      "--proxy-server='direct://",
      '--disable-extensions',
      '--proxy-bypass-list=*',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
  const page = await browser.newPage();
  await page.goto(targetUrl);
  await page.waitFor(2 * 1000);

  const result = await page.$$eval(cssBooksForPage, elArray =>
    elArray.map(el => el.innerText)
  );

  // const bookHandle = await page.evaluateHandle(function(sel) {
  //   return document.querySelector(sel);
  // }, cssBookLink);

  const bookHandle = await page.evaluateHandle(
    sel => document.querySelector(sel),
    cssBookLink
  );

  // await page.evaluateHandle(function(link) {
  //   link.click();
  // }, bookHandle);

  await page.evaluateHandle(link => link.click(), bookHandle);

  await page.waitFor(1 * 1000);
  await page.screenshot({ path: 'screenshots/book.png' });
  browser.close();
  return result;
};

scrape().then(value => {
  console.log(value); // Success!
});
