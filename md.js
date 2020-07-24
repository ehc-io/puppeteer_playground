const puppeteer = require('puppeteer');
const chalk = require('chalk');
const fs = require('fs');

// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword('green');

(async () => {
  try {
    // open the headless browser
    var browser = await puppeteer.launch({ headless: true });
    // open a new page
    const page = await browser.newPage();
    // enter url in page
    await page.goto(`https://news.ycombinator.com/`);
    await page.waitForSelector('a.storylink');

    const news = await page.evaluate(() => {
      const titleNodeList = document.querySelectorAll(`a.storylink`);
      const ageList = document.querySelectorAll(`span.age`);
      const scoreList = document.querySelectorAll(`span.score`);
      const titleLinkArray = [];
      for (let i = 0; i < titleNodeList.length; i++) {
        titleLinkArray[i] = {
          title: titleNodeList[i].innerText.trim(),
          link: titleNodeList[i].getAttribute('href'),
          age: ageList[i].innerText.trim(),
          score: scoreList[i].innerText.trim(),
        };
      }
      return titleLinkArray;
    });
    // console.log(news);
    await browser.close();
    // Writing the news inside a json file
    // fs.writeFile('hackernews.json', JSON.stringify(news), function(err) {
    //   if (err) throw err;
    //   console.log('Saved!');
    // });
    console.log(JSON.stringify(news, null, 2));
    console.log(success('Browser Closed'));
  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    await browser.close();
    console.log(error('Browser Closed'));
  }
})();
