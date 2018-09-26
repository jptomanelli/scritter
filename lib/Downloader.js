const axios = require('axios'),
    fs = require('fs');

class Downloader {
    constructor(fullPath) {
        this.fullPath = fullPath;
    }

    async followLinkListRecursive(url, ctr = 0) {
        return new Promise(async (resolve, reject) => {
            let response = await this.downloadFile(url);

            if (response.status != 200) {
                reject(`Error on recursive download: response status = ${response.status}; url: ${url}`);
            }

            const data = response.data;
            this.writeFileSync(`json_${ctr}.html`, data.items_html)
            const urlObj = new URL(url);

            if (data.min_position != urlObj.searchParams.get('max_position')) {
                
                urlObj.searchParams.delete('max_position');
                urlObj.searchParams.set('max_position', data.min_position);
                ctr = ctr += 1;
                const res = await this.followLinkListRecursive(urlObj.href, ctr);
                resolve(res);
            }

            resolve();
        });
    }

    async downloadFile(url) {
        return await axios.get(url);
    }

    writeFileSync(file, data) {
        fs.writeFileSync(`${this.fullPath}${file}`, data);
    }
}

module.exports = Downloader;