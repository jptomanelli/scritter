# Scritter

> Scrape tweets and save to a JSON file

## Install

```bash
npm install --save scritter
```

## Usage

###Basic
```javascript
const Scritter = require('scritter'),
    fs = require('fs');
(async (username) => {
    const s = new Scritter({ 
        downloadDir: `${__dirname}`     //  Where to save JSON
    });
    
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);              //  Create a for username data
    }

    await s.scrape({
        from: username                  //  Scrape user profile
    });

})();
```

###Options

```javascript
//  Default
const s = new Scritter({ 
    l: 'en',
    url: 'https://twitter.com/search',
    src: 'typd',
    downloadDir: '/'
});
await s.scrape({
    from: username,             //  From
    to: other_username,         //  To
    '@': other_other_username,  //  Mention
    since: yesterday,
    until: today
});
```

## License

[MIT](http://vjpr.mit-license.org)

[npm-url]: https://npmjs.org/package/scritter