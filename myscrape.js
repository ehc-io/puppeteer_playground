const puppeteer = require('puppeteer');

const targetUrl = 'http://books.toscrape.com/';
const cssBooksForPage = 'li.col-xs-6';

const scrape = async () => {
  console.log('Running...');
  console.log('Initiating browser session...');
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    devtools: true,
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
  await page.waitFor(1 * 1000);

  const booksForPage = await page.evaluate(function(sel) {
    const elArray = [];
    const items = document.querySelectorAll(sel);
    for (let i = 0; i < items.length; i += 1) {
      elArray.push({
        url: items[i].children[0].children[0].children[0].href,
        title: items[i].children[0].children[2].innerText,
      });
    }
    return elArray;
  }, cssBooksForPage);
  //
  booksForPage.forEach(function(book) {
    console.log(`${book.title}`);
  });
  console.log(`There are ${booksForPage.length} elements in this page`);
  await page.waitFor(100 * 1000);
  await page.screenshot({ path: 'screenshots/book.png' });
  browser.close();
};

scrape().then(value => {
  console.log(value); // Success!
});
