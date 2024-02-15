const {Builder, Browser, By, Key, until, logging} = require('selenium-webdriver');
const { Options } = require("selenium-webdriver/chrome");

(async function example() {
  let driver = await new Builder().forBrowser(Browser.CHROME)
                    .setChromeOptions(new Options()
                                    .setChromeBinaryPath('/Applications/Google Chrome69.app/Contents/MacOS/Google Chrome')
                    )
                    .build();

  try {
    // 进入网站
    await driver.get('https://www.google.com/ncr');
    // 找到输入框，输入webdriver，键入回车
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    // 当title是'webdriver - Google Search'时继续执行，10000后算超时
    await driver.wait(until.titleIs('webdriver - Google Search'), 10000);

    // 通过id执行脚本
    var element = await driver.findElement(By.id("u_0_a"));
    await driver.executeScript("arguments[0].click();", element)

    // 通过链接点击，通过className找到元素
    await driver.findElement(By.linkText("archive")).click();
    var elems = await driver.findElements(By.className('ng-pristine'));

    // 下拉页面到底部
    js = 'document.documentElement.scrollTop = document.documentElement.scrollHeight'
    driver.executeScript(js)

    // 太快了不行，需要延时
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    console.log(1)
    await sleep(1000)
    console.log(2)

  } finally {
    // await driver.quit();
  }
})();