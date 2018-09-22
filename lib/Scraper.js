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

        if (!this.page) {
            throw new Error('Need valid page to scrape');
        }

        await this.loadWholePage();
        let tweets = await this.getVisibleTweets();

        return tweets;
    }

    async getVisibleTweets() {

        const tweets = await this.page.evaluate(() => {

            const text = [];
            const els = document.querySelectorAll('p.tweet-text:not(.done)');
            
            for(let el of els) {
                text.push(el.innerHTML);
                el.classList.add('done');
            }

            window.scrollTo(0,document.body.scrollHeight);

            return text;
        })

        return tweets;
    }

    async hasMoreItems() {

        const res = await this.page.evaluate(async () => {

            const delay = ms => new Promise(res => setTimeout(res, ms));
            await delay(10000);
            const itemCount = document.getElementsByClassName('has-more-items').length;
            
            return itemCount > 0;

        });

        return res;
    }

    async loadWholePage() {
        const res = await this.page.evaluate(async () => {

            const delay = ms => new Promise(res => setTimeout(res, ms));
            while (document.getElementsByClassName('has-more-items').length) {
                window.scrollTo(0,document.body.scrollHeight);
                await delay(5000);
                window.scrollTo(0,document.body.scrollHeight);
                if (document.getElementsByClassName('stream-end-inner')) {
                    window.scrollTo(0,document.body.scrollHeight);
                    await delay(5000);
                    window.scrollTo(0,document.body.scrollHeight);
                }
            }
                
        }); 
    }

}

module.exports = Scraper;