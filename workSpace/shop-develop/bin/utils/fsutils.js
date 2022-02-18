const fs = require('fs');
const path = require('path');

function copy(src, dst) {
    let files = fs.readdirSync(src);
    for (let file of files) {
        const _src = path.resolve(src, file);
        const _dst = path.resolve(dst, file);
        let stats = fs.statSync(_src);
        if (stats.isFile()) {
            fs.copyFileSync(_src, _dst);
        } else if (stats.isDirectory()) {
            checkDirectory(_src, _dst, copy);
        }
    }
}

/**
 * 复制目录
 * @param {*} src 源目录
 * @param {*} dst 目标目录
 */
function checkDirectory(src, dst) {
    try {
        fs.accessSync(dst, fs.constants.F_OK);
        copy(src, dst);
    } catch (error) {
        fs.mkdirSync(dst);
        copy(src, dst);
    }
};

module.exports = checkDirectory;
