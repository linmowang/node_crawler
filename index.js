const {Builder, Browser, By, Key, until, logging} = require('selenium-webdriver');
const { Options } = require("selenium-webdriver/chrome");

(async function example() {
  let driver = await new Builder().forBrowser(Browser.CHROME)
                    .setChromeOptions(new Options().setChromeBinaryPath('/Applications/Google Chrome69.app/Contents/MacOS/Google Chrome'))
                    .build();

  // logging.installConsoleHandler()
  // logging.getLogger(`${logging.Type.DRIVER}.http`).setLevel(logging.Level.ALL)
  try {
    await driver.get('https://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } finally {
    await driver.quit();
  }
})();