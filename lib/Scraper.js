class Scraper {

    constructor(page = null) {

        if (page) {
            this.setPage(page);
        }

    }

    setPage(page) {

        this.page = page;

    }

    async scrape() {
        return new Promise(async (resolve, reject) => {

            if (!this.page) {
                reject('Need valid page to scrape');
            }

            const tweets = await this.parse();

            const dataUrl = await this.getFileHeadUrl();

            resolve({tweets: tweets, nextUrl: dataUrl });

        });
    }

    async parse() {
        return await this.page.evaluate(() => {
            const data = [];
            const items = document.querySelectorAll('li[data-item-type="tweet"]');
            for(let item of items) {
                data.push({
                    id: item.getAttribute('data-item-id'),
                    content: item.querySelector('div.js-tweet-text-container p.tweet-text').innerHTML,
                    timestamp: item.querySelector('div.stream-item-header a.tweet-timestamp').title,
                    retweet: item.getElementsByClassName('ProfileTweet-action--retweet')[0].innerText,
                    reply: item.getElementsByClassName('ProfileTweet-action--reply')[0].innerText,
                    favorite: item.getElementsByClassName('ProfileTweet-action--favorite')[0].innerText,
                    isReply: item.getElementsByClassName('QuoteTweet').length
                });
            }
            
            return data;
        });
    }

    async scrollPage() {
        const res = await this.page.evaluate(async () => {
            window.scrollTo(0, document.body.scrollHeight);
        });
    }

    async getFileHeadUrl() {
        return new Promise(async (resolve, reject) => {
            this.page.on('request', request => {
                if (request._url.includes('https://twitter.com/i/search/timeline?'))
                    resolve(request._url);
            });
            await this.scrollPage();
        })
    }

}

module.exports = Scraper;