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
      let tweets = scraperObject.tweets;
      
      const downloader = new Downloader(this.options.downloadDir);
      await downloader.followLinkListRecursive(scraperObject.nextUrl);
      await page.goto(`file://${this.options.downloadDir}payload.html`);

      const bulkTweets = await scraper.parse();

      tweets = tweets.concat(bulkTweets);

      downloader.appendFileSync('tweets.json', JSON.stringify(tweets));

      browser.close();

      resolve();

    });
  }

}


module.exports = Scritter;