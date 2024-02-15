const screenshot = require('screenshot-desktop');
const fs = require('fs');

screenshot().then((img) => {
  fs.writeFile(__dirname + '/file/screenshot.png', img, 'base64', (err) => {
    if (err) throw err;
    console.log('Screenshot saved!');
  });
});