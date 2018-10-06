const pup = require('puppeteer'),
  QueryBuilder = require('./QueryBuilder'),
  defaultOptions = require('./Options'),
  Scraper = require('./Scraper'),
  Downloader = require('./Downloader');

class Scritter {

  constructor(options = {}) {

    if (!options.downloadDir) {
      throw new Error('Need to set downloadDir option');
    }

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
      const pupOptions = {};

      const url = `${this.options.url}?${query}`;

      if (this.options.disableSandbox) {
        pupOptions.args =  ['--no-sandbox', '--disable-setuid-sandbox'];
      }

      if (this.options.chromiumExePath) {
        pupOptions.executablePath = this.options.chromiumExePath;
      }

      const browser = await pup.launch(pupOptions);
      const page = await browser.newPage();

      await page.goto(url);

      const scraper = new Scraper(page);

      const scraperObject = await scraper.scrape();
      let tweets = scraperObject.tweets;
      
      const downloader = new Downloader(this.options.downloadDir);

      if (scraperObject.nextUrl) {
        await downloader.followLinkListRecursive(scraperObject.nextUrl);
      }

      await page.goto(`file://${this.options.downloadDir}/payload.html`);

      const bulkTweets = await scraper.parse();

      tweets = tweets.concat(bulkTweets);

      downloader.appendFileSync('tweets.json', JSON.stringify(tweets));

      browser.close();

      resolve(tweets);

    });
  }

}


module.exports = Scritter;