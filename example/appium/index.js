// npm i -g appium
// 教学文章：https://medium.com/automationmaster/appium-mobile-app-automation-406bf8b0fd80

// 需要下载andriod sdk https://developer.android.com/studio
// 配置ANDROID_HOME环境变量，添加到PATH中
// 下载客户端 https://github.com/appium/appium-inspector/releases
// 还需要apk(你自己开发的安卓包)

const {remote} = require('webdriverio');

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'com.android.settings',
  'appium:appActivity': '.Settings',
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: 'info',
  capabilities,
};

async function runTest() {
  const driver = await remote(wdOpts);
  try {
    const batteryItem = await driver.$('//*[@text="Battery"]');
    await batteryItem.click();
  } finally {
    await driver.pause(1000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);