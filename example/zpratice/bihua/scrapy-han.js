var express = require('express');
var router = express.Router();
const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio');
var request = require('request')
const { execSync } = require('child_process')
const readline = require('readline');

const fd = fs.openSync('./otherSql.txt', 'wx')

const aTobList = [
  {
    a: 'ā',
    b: 'a',
    yindiao: 1 
  },
  {
    a: 'á',
    b: 'a',
    yindiao: 2
  },
  {
    a: 'ǎ',
    b: 'a',
    yindiao: 3
  },
  {
    a: 'à',
    b: 'a',
    yindiao: 4
  },
  {
    a: 'ō',
    b: 'o',
    yindiao: 1 
  },
  {
    a: 'ó',
    b: 'o',
    yindiao: 2
  },
  {
    a: 'ǒ',
    b: 'o',
    yindiao: 3
  },
  {
    a: 'ò',
    b: 'o',
    yindiao: 4
  },
  {
    a: 'ē',
    b: 'e',
    yindiao: 1 
  },
  {
    a: 'é',
    b: 'e',
    yindiao: 2
  },
  {
    a: 'ě',
    b: 'e',
    yindiao: 3
  },
  {
    a: 'è',
    b: 'e',
    yindiao: 4
  },
  {
    a: 'ī',
    b: 'i',
    yindiao: 1 
  },
  {
    a: 'í',
    b: 'i',
    yindiao: 2
  },
  {
    a: 'ǐ',
    b: 'i',
    yindiao: 3
  },
  {
    a: 'ì',
    b: 'i',
    yindiao: 4
  },
  {
    a: 'ū',
    b: 'u',
    yindiao: 1 
  },
  {
    a: 'ú',
    b: 'u',
    yindiao: 2
  },
  {
    a: 'ǔ',
    b: 'u',
    yindiao: 3
  },
  {
    a: 'ù',
    b: 'u',
    yindiao: 4
  },
  {
    a: 'ü',
    b: 'v',
    yindiao: ''
  },
  {
    a: 'ǘ',
    b: 'v',
    yindiao: 2
  },
  {
    a: 'ǚ',
    b: 'v',
    yindiao: 3
  },
  {
    a: 'ǜ',
    b: 'v',
    yindiao: 4
  },
]

// 爬虫请求数据
const requestFont = (fontObject) => {
  const fontObj = fontObject
  const {
    word
  } = fontObj
  
  const fontUtf = encodeURIComponent(word)
  const url = `http://www.zdic.net/hans/${fontUtf}`

  const timeoutInMilliseconds = 10*1000
  const opts = {
    url: url,
    timeout: timeoutInMilliseconds
  }

  request(opts, async function (err, res, body) {
    if (err) {
      console.dir(err)
      return
    }

    const statusCode = res.statusCode
    console.log('status code: ' + statusCode)

    const $ = cheerio.load(`${body}`)
    const pinyinList = $('.dsk .z_py .z_d.song')
    const pyList = []

    pinyinList.each((index, element) => {
      pyList.push($(element).text())
      console.log(index, $(element).text(), $(element).children().children().attr('data-src-mp3'))
    })

    let pinyin = pyList[0]
    // 拼音
    let pyTwo = pinyin
    for (let i = 0; i < aTobList.length; i++) {
      const obj = aTobList[i];
      if (pinyin.indexOf(obj.a) > -1) {
        pyTwo = pyTwo.replace(obj.a, obj.b)
        pyTwo = pyTwo + obj.yindiao
      }
    }

    fontObj.pinyin_audio = `https://img1.zhiduoke.com.cn/pinyinVoice/${pyTwo}.mp3`
    
    const bushouList = $('.z_bs2 p')
    bushouList.each((index, element) => {
      if (index === 0) {
        // 部首
        const s = $(element).children('a').text()
        console.log(index, s.trim());
        fontObj.bushou = s.trim()
      }
    })

    // 字形分析
    const zixingjiegou = $('.dsk tr .z_bis2').prev().text()
    fontObj.structure = zixingjiegou
    
    // 基本会义
    const descriptionList = []
    const jibenhuiyi = $('.content.definitions.jnr ol')
    jibenhuiyi.each((index, element) => {
      console.log($(element).text())
      const list = $(element).text().trim().split(/[\s]+/)
      if (list.length && list[0] !== '') {
        list.unshift(pyList[index])
        descriptionList.push(list)
      }
    })
    fontObj.description = JSON.stringify(descriptionList)


    if (!fs.existsSync(`./pinyinVoice/${pyTwo}.mp3`)) {
      execSync(`curl 'https://c.cidianwang.com/file/duyin/${pyTwo}.mp3' -o ./pinyinVoice/${pyTwo}.mp3`, { stdio: 'inherit' })
    }
    
    console.log(fontObj.word, fontObj.pinyin_audio, fontObj.bushou, fontObj.structure, fontObj.description)
    console.log('end: ', new Date().toString())
    // const sql = `update liangyin.chinese_words set bihua = '${fontObj.stroke}', draw_data = '${fontObj.points}', pinyin = '${fontObj.pronunciation}', pinyin_audio = '${fontObj.pinyin_audio}',structure='${fontObj.structure}',bushou='${fontObj.bushou}',description='${fontObj.description}' where word = '${fontObj.word}' and word_set=0;`
    const sql = `insert into liangyin.chinese_words (word, word_group, video, gif, information, points, bihua, draw_data, pinyin, pinyin_audio,
      is_special, update_time, delete_time, create_time, word_set, special_cover, breakpoint,
      structure, bushou, description, font_nls_url)
values ('${fontObj.word}','','','','','','${fontObj.stroke}','${fontObj.points}','${fontObj.pronunciation}','${fontObj.pinyin_audio}',0,unix_timestamp(),0,unix_timestamp(),0,'','','${fontObj.structure}','${fontObj.bushou}','${fontObj.description}', '');`
    fs.appendFile(fd, `${sql}\n`, function () {
      console.log(sql, '的内容已存入')
    }) 

  })
}

/* GET home page. */
router.get('/', function(req, res, next) {
  // 一行一行解读1-2font.txt
  // 生成一个新的xlsx文件，分四个字段存入：字、笔画、发音、坐标

  const rl = readline.createInterface({
    input: fs.createReadStream('other.txt'),
    crlfDelay: Infinity
  });

  let rowList = []
  
  rl.on('line', (line) => {
    // hzbh.main('此',{此:[6,'fjfisu','0:(234,66) (258,90) (258,636)#1:(258,336) (414,336) (378,324) (342,336)#2:(114,234) (132,252) (132,666)#3:(24,672) (48,696) (408,594)#4:(678,192) (696,216) (612,288) (534,348) (456,396)#5:(432,66) (456,90) (456,666) (462,690) (474,702) (504,714) (642,714) (684,708) (720,696) (732,558)','cǐ']});document.getElementById("tianzi_jie_guo_dixiabeizhu").innerHTML = "一共<b>1</b>个汉字，共计笔画：<b>6</b>画";
    // hzbh.main('口',{口:[3,'fcj','0:(150,660) (150,126)#1:(150,156) (612,156) (642,126) (612,156) (612,654)#2:(612,582) (150,582)','kǒu']});document.getElementById("tianzi_jie_guo_dixiabeizhu").innerHTML = "一共<b>1</b>个汉字，共计笔画：<b>3</b>画";
    let content = line.split('});')[0]
    content = content.split("hzbh.main('")[1]
    content = content.split("',{")[1]
    const contentList = content.split(':[')
    const word = contentList[0]
    const listStr = `[${contentList[1]}`
    const list = JSON.parse(listStr.replace(/\'/g, '\"'))

    const fontOject = {}
    fontOject.word = word
    fontOject.stroke = list[1]
    fontOject.points = list[2]
    fontOject.pronunciation = list[3]
    // const curRow = [fontOject.word, fontOject.stroke, fontOject.pronunciation, fontOject.points]
    rowList.push(fontOject)
  })

  rl.on("close", () => {
    let i = 0
    const lg = rowList.length

    const interval = setInterval(() => {
      const fontOject = rowList[i++]
      console.log('fontOject:', i, fontOject)
      // 请求
      if(fontOject) {
        requestFont(fontOject)
      }
  
      if(fontOject && i > lg - 1) {
        setTimeout(() => {
          console.log('last index: ', i);
          clearInterval(interval)
          fs.close(fd, () => {
            console.log('文件已关闭')
            clearInterval(interval)
          })
        }, 4000)
      }
    }, 4000)
  })
  
  res.render('index', { title: 'Express', font: '解读' })
});

module.exports = router;
