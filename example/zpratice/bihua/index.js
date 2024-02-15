const { requestFont } = require('./scrapy-font')
function init() {
  const fonts = '迩裕屈惺趾蹑琳娟刨琅'
  
  let fontsList = fonts.split('')
  let i = 0
  const lg = fontsList.length

  fs.open('./other.txt', 'wx', (err, fd) => {
    console.log(err, fd);
    if (err) {
      if (err.code === 'EEXIST') {
        console.error('file already exists');
      } else {
        throw err;
      }
    }
    console.log('startDate: ', new Date())
  
    const interval = setInterval(() => {
      const font = fontsList[i++]
      console.log('font:', i, font)
      // 请求
      if(font) {
        requestFont(font, fd)
      }

      if (font && i > lg - 1) {
        setTimeout(() => {
          fs.close(fd, () => {
            console.log('endDate: ', new Date())
            console.log('文件已关闭')
            console.log('没爬到的字:', unRecordFontStr)
            clearInterval(interval)
          })
        }, 2000)
      }
    }, 2000)
  })
}

init()