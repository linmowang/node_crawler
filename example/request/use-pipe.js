const request = require('request')
const fs = require('fs');

// 下载图片
let fileStream = fs.createWriteStream(__dirname + '/file/logo.svg');
request('https://nodejs.org/static/images/logo.svg').pipe(fileStream);
