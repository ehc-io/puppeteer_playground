const puppeteer = require('puppeteer');

const targetUrl = 'http://books.toscrape.com/';
const cssBooksForPage = 'li.col-xs-6';

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(targetUrl);
  await page.waitFor(3 * 1000);
  console.log('--------');

  // const result = await page.$$eval(cssBooksForPage, function(elArray) {
  //   const resultArray = [];
  //   for (let i = 0; i < elArray.length; i += 1) {
  //     resultArray.push(elArray[i].innerText);
  //     // Não rola colocar console log dentro de page.(metodos)
  //     // console.log(elArray[i].innerText);
  //   }
  //   return resultArray;
  // });

  // const result = await page.$$eval(cssBooksForPage, elArray =>
  //   elArray.map(function(el) {
  //     return el.innerText;
  //   })
  // );

  const result = await page.$$eval(cssBooksForPage, elArray =>
    elArray.map(el => el.innerText)
  );

  // await page.click(cssMybook);
  // await page.waitFor(2 * 1000);
  // result = await page.evaluate(() => {
  //   const r = document.querySelectorAll('li.col-xs-6');
  //   return r;
  // });
  // console.log(`This is my result: ${JSON.stringify(result)}`);
  browser.close();
  return result;
};

scrape().then(value => {
  console.log(value); // Success!
});
