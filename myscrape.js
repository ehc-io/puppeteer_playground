const puppeteer = require('puppeteer');

const targetUrl = 'http://books.toscrape.com/';
const cssBooksForPage = 'li.col-xs-6';

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(targetUrl);
  await page.waitFor(2 * 1000);
  console.log('--------');

  const result = await page.$$eval(cssBooksForPage, elArray =>
    elArray.map(el => el.innerText)
  );

  // const result = await page.$$eval(cssBooksForPage, elArray =>
  //   elArray.map(el => el.innerText)
  // );

  browser.close();
  return result;
};

scrape().then(value => {
  console.log(value); // Success!
});
