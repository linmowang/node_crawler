const request = require('request')
// const CryptoJS = require('crypto-js')
var SHA256 = require("crypto-js/sha256");
const fs = require('fs')

let url = 'http://example.com/super-sensitive-data.json';
let pwd = new Buffer('myPassword');

let aesTransform = SHA256(pwd)
let fileStream = fs.createWriteStream(__dirname + '/file/encrypted.json');

request(url)
    .pipe(aesTransform)     // Encrypts with aes256
    .pipe(fileStream)       // Write encrypted data to a file
    .on('finish', function() {
        console.log('Done downloading, encrypting, and saving!');
    });