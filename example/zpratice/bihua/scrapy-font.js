const path = require('path')
const fs = require('fs')
var https = require('https');

let unRecordFontStr = ''

// 爬虫请求数据
export const requestFont = (font, fd) => {
  // https://bihua.bmcx.com/web_system/bmcx_com_www/system/file/bihua/get_0/?font=${fontUtf}&shi_fou_zi_dong=1&cache_sjs1=20031912
  // 步骤 3
  const fontUtf = encodeURIComponent(font).replace(/%/g, "").toLowerCase()

  const req = https.get(`https://bihua.bmcx.com/web_system/bmcx_com_www/system/file/bihua/get_0/?font=${fontUtf}&shi_fou_zi_dong=1&cache_sjs1=20031912`, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));

    // 记一下没取到的font
    if (res.statusCode !== 200) {
      unRecordFontStr += font
    }
  
    // Buffer the body entirely for processing as a whole.
    var bodyChunks = [];
    res.on('data', function(chunk) {
      bodyChunks.push(chunk);
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);
      console.log('BODY: ' + body);
      console.log(fd);
      fs.appendFile(fd, `${body}\n`, function () {
        console.log(font, '的内容已存入')
      })
    })
  });
  
  req.on('error', function(e) {
    console.log('ERROR: ' + e.message);
  })
}



