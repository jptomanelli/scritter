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

## License

[MIT](http://vjpr.mit-license.org)

[npm-url]: https://npmjs.org/package/scritter