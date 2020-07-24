const puppeteer = require('puppeteer');

const targeturl = 'http://books.toscrape.com/';
const css_myboo =
  '#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img';
const scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(targeturl);
  await page.waitFor(3 * 1000);
  await page.click(css_myboo);
  await page.waitFor(3 * 1000);

  const result = await page.evaluate(() => {
    const title = document.querySelector('h1').innerText;
    const price = document.querySelector('.price_color').innerText;

    return {
      title,
      price,
    };
  });

  browser.close();
  return result;
};

scrape().then(value => {
  console.log(value); // Success!
});
