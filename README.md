# Scritter

> Scrape tweets and save to a JSON file

## Install

```bash
npm install --save scritter
```

## Usage

### Basic
```javascript
const Scritter = require('scritter'),
    fs = require('fs');
(async () => {
    const s = new Scritter({ 
        downloadDir: `${__dirname}/data/`   //  Where to save JSON (required)
    });
    
    await s.scrape({
        from: username                      //  Scrape user profile
    });

})();
```

### Options

```javascript
//  Default
const s = new Scritter({ 
    url: 'https://twitter.com/search',
    src: 'typd',
    disableSandbox: false,
    l: '',                      //  Language 
    downloadDir: `~/Downloads/` //  Where JSON will be downloaded
});
await s.scrape({
    from: username,             //  From
    to: other_username,         //  To
    '@': other_other_username,  //  Mention
    since: yesterday,
    until: today
});
```

### Issues

https://github.com/Googlechrome/puppeteer/issues/290

There is a bug in Debian that can be resolved by installing the following packages and by setting disableSandbox to true.

```bash
apt-get update && \
apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```


## License

[MIT](http://vjpr.mit-license.org)

[npm-url]: https://npmjs.org/package/scritter