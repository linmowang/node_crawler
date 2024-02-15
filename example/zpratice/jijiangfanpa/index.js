// 找出前100个搜索中除了白名单之外的网站
const {Builder, Browser, By, Key, until, logging} = require('selenium-webdriver');
const { NoSuchElementError } = require('selenium-webdriver/lib/error')
const { Options } = require("selenium-webdriver/chrome");
const fs = require('fs');
const { log } = require('console');

(async function example() {
  let driver = await new Builder().forBrowser(Browser.CHROME)
                    .setChromeOptions(new Options().setChromeBinaryPath('/Applications/Google Chrome69.app/Contents/MacOS/Google Chrome'))
                    .build();

  const search = '有匪'
  const urlWhitelist = [
    'jjwxc.net',
    'weibo.com',
    'baidu.com',
    'wikipedia.org',
    'sogou.com',
    'douban.com ',
    'zhihu.com'
  ]

  function isInWhiteList(url) {
    return urlWhitelist.find((item) => {
      return url.search(item) > -1
    })
  }

  // console.log(isInWhiteList('https://fanqienovel.com'));
  // console.log(isInWhiteList('https://www.jjwxc.net › onebook'));
  // console.log(isInWhiteList('https://m.jjwxc.net'));
  // console.log(isInWhiteList('https://weibo.com › ...'));

  function isNullOrError(element) {
    return !element || (element && element.remoteStacktrace)
  }
  try {
    await driver.get('https://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys(search, Key.RETURN);
    await driver.wait(until.titleIs(search + ' - Google Search'), 10000)
    // console.log(await driver.findElement(By.css('title')).getText());
    let webList = await driver.findElements(By.css('.MjjYud'))

    webList.forEach(async (element, index) => {
        let title = ''
        let url = ''
        let isNotSteal = false

        // title
        const titleElement = await element.findElement(By.css('h3')).catch((err) => console.log('h3 没有找到元素'))
        
        // undefined 或者 WebDriverError
        if (isNullOrError(titleElement)) {
          // console.log(111,titleElement);
        } else {
          title = await titleElement.getText()
        }

        // url
        const urlElement = await element.findElement(By.css('cite')).catch((err) => console.log('cite 没有找到元素'))
        if (isNullOrError(urlElement)) {
          // console.log(111,urlElement);
        } else {
          url = await urlElement.getText()
          if (isInWhiteList(url)) {
              isNotSteal = true
          }
        }

        if (!isNotSteal) {
          console.log(index,title, url);
        }
        
    })

    // await driver.findElement(By.name('q')).sendKeys(search, Key.RETURN);
    // await driver.wait(until.titleIs('webdriver - Google Search'), 1000);

  } finally {
    // await driver.quit();
  }
})();