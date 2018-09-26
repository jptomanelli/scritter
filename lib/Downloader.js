const axios = require('axios'),
    fs = require('fs');

class Downloader {
    constructor(fullPath) {
        this.fullPath = fullPath;
    }

    async followLinkListRecursive(url) {
        return new Promise(async (resolve, reject) => {
            let response = await this.downloadFile(url);

            if (response.status != 200) {
                reject(`Error on recursive download: response status = ${response.status}; url: ${url}`);
            }

            const data = response.data;
            this.appendFileSync(`payload.html`, data.items_html)
            const urlObj = new URL(url);

            if (data.min_position != urlObj.searchParams.get('max_position')) {
                
                urlObj.searchParams.delete('max_position');
                urlObj.searchParams.set('max_position', data.min_position);
                const res = await this.followLinkListRecursive(urlObj.href);
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

    appendFileSync(file, data) {
        fs.appendFileSync(`${this.fullPath}${file}`, data);
    }
}

module.exports = Downloader;