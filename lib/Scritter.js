const pup = require('puppeteer'),
  QueryBuilder = require('./QueryBuilder'),
  defaultOptions = require('./Options'),
  Scraper = require('./Scraper'),
  moment = require('moment'),
  progressBar = require('progress');

class Scritter {

  constructor(options = {}) {
    this.setOptions(options);
  }

  setOptions(options = {}) {
    this.options = Object.assign(options, defaultOptions);
  }

  scrape(options = {}) {
    return new Promise(async (resolve, reject) => {
      let tweets = [];
      const queryBuilder = new QueryBuilder(this.options);
      const query = queryBuilder.buildQuery(options);

      const url = `${this.options.url}?${query}`;

      const browser = await pup.launch();
      const page = await browser.newPage();

      await page.goto(url);

      try {
        const scraper = new Scraper(page);

        tweets = await scraper.scrape();
      } catch (err) {
        console.error(err);
      }

      await browser.close();
      resolve(tweets);
    });
  }

  async scrapeDaily(options = {}) {
    const last = moment(options.since);
    let current = moment();
    const bar = new progressBar(':current/:total :bar', { total: current.diff(last, 'days') });

    let tweets = [];

    while(last.isBefore(current)) {
      bar.tick();
      options.until = current.format('MM-DD-YYYY');
      options.since = current.subtract(1, 'days').format('MM-DD-YYYY');
      let tmp = await this.scrape(options);
      tweets = tweets.concat(tmp);
      current = current.subtract(1, 'days');
    }

    return tweets;
  }


}


module.exports = Scritter;