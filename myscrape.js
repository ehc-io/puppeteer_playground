const puppeteer = require('puppeteer');

const targetUrl = 'http://books.toscrape.com/';
const cssBooksForPage = 'li.col-xs-6';

const scrape = async () => {
  console.log('Running...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(targetUrl);
  await page.waitFor(2 * 1000);

  // const result = await page.evaluate(sel => {
  //   const bookArray = [];
  //   const elArray = document.querySelectorAll(sel);
  //   // const bookArray = elArray.forEach(el => el.innerText);
  //   for (let i = 0; i < elArray.length; i += 1) {
  //     bookArray.push(elArray[i].innerText);
  //   }
  //   return bookArray;
  // }, cssBooksForPage);

  const result = await page.evaluate(sel => {
    const elArray = document.querySelectorAll(sel);
    const bookArray = elArray.forEach(el => el.innerText);
    return bookArray;
  }, cssBooksForPage);

  // const result = await page.$$eval(cssBooksForPage, elArray =>
  //   elArray.map(el => el.innerText)
  // );

  browser.close();
  return result;
};

scrape().then(value => {
  console.log(value); // Success!
});
