const fs = require('fs');

class Utils {

    static isValidDir(path) {
        return new Promise((resolve, reject) => {
            fs.lstat(path, (err, stats) => {
                if (err) {
                    reject(err);
                }
                resolve(stats.isDirectory());
            });
        });
    }

}

module.exports = Utils;