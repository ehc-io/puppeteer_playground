const puppeteer = require('puppeteer');

const targetUrl = 'http://books.toscrape.com/';
const cssBooksForPage = 'li.col-xs-6';

async function initbrowser() {
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
  return browser;
}

async function scrape(browser, pagesToScrape) {
  if (!pagesToScrape) {
    pagesToScrape = 1;
  }
  console.log(`Pages to scrape: ${pagesToScrape}`);
  const page = await browser.newPage();
  await page.goto(targetUrl);
  await page.waitFor(1 * 1000);
  let currentPage = 1;
  let bookStore = [];
  //
  while (currentPage <= pagesToScrape) {
    console.log(`Scraping page: ${currentPage}`);
    const booksForPage = await page.evaluate(function(sel) {
      const elArray = [];
      const items = document.querySelectorAll(sel);
      items.forEach(function(book) {
        elArray.push({
          url: book.children[0].children[0].children[0].href,
          title: book.children[0].children[2].innerText,
        });
      });
      return elArray;
    }, cssBooksForPage);
    booksForPage.forEach(function(book) {
      console.log(`${book.title}`);
    });
    console.log(`----- end of page ----`);
    bookStore = bookStore.concat(booksForPage);
    await page.screenshot({ path: 'screenshots/book.png' });
    // await page.waitFor(3 * 1000);
    if (currentPage < pagesToScrape) {
      await page.click('li.next');
      await page.waitFor(1 * 1000);
    }
    currentPage += 1;
  }
  console.log(`There are ${bookStore.length} books in this book store`);
  browser.close();
  return bookStore;
  //
}

async function main() {
  const browserSession = await initbrowser();
  scrape(browserSession, 5)
    .then(() => console.log(`That was a huge success!!!`))
    .catch(e => console.log(`Sorry, my bad !!! I've got an error: ${e}`));
}

main();
