const {Builder, Browser, By, Key, until, logging} = require('selenium-webdriver');
const { Options } = require("selenium-webdriver/chrome");

const screenshot = require('screenshot-desktop');
const fs = require('fs');
const { log } = require('console');

(async function example() {
  let driver = await new Builder().forBrowser(Browser.CHROME)
                    .setChromeOptions(new Options().setChromeBinaryPath('/Applications/Google Chrome69.app/Contents/MacOS/Google Chrome'))
                    .build();

  try {
    await driver.get('https://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys('春山别鹤', Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    driver.takeScreenshot().then(
      function(image, err) {
          fs.writeFile(__dirname + '/file/screenshot.png', image, 'base64', function(err) {
              console.log(err);
          });
      }
    );

  } finally {
    // await driver.quit();
  }
})();