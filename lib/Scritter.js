const pup = require('puppeteer'),
  QueryBuilder = require('./QueryBuilder'),
  defaultOptions = require('./Options'),
  Scraper = require('./Scraper'),
  Downloader = require('./Downloader');

class Scritter {

  constructor(options = {}) {
    this.setOptions(options);

    this.Options = defaultOptions;
    this.QueryBuilder = QueryBuilder;
    this.Scraper = Scraper;
    this.Downloader = Downloader;
  }

  setOptions(options = {}) {
    this.options = Object.assign(defaultOptions, options);
  }

  scrape(options = {}) {
    return new Promise(async (resolve, reject) => {
      const queryBuilder = new QueryBuilder(this.options);
      const query = queryBuilder.buildQuery(options);

      const url = `${this.options.url}?${query}`;

      const browser = await pup.launch();
      const page = await browser.newPage();

      await page.goto(url);

      const scraper = new Scraper(page);

      const scraperObject = await scraper.scrape();

      await browser.close();
      
      const downloader = new Downloader(this.options.downloadDir);
      downloader.writeFileSync('firstPage.json', JSON.stringify(scraperObject.tweets));
      downloader.followLinkListRecursive(scraperObject.nextUrl);

    });
  }

}


module.exports = Scritter;