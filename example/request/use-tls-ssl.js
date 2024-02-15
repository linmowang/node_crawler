const fs = require('fs');
const request = require('request');

let myCertFile = fs.readFileSync(__dirname + '/ssl/client.crt')
let myKeyFile = fs.readFileSync(__dirname + '/ssl/client.key')
let myCaFile = fs.readFileSync(__dirname + '/ssl/ca.cert.pem')
 
var options = {
    url: 'https://mockbin.com/request',
    cert: myCertFile,
    key: myKeyFile,
    passphrase: 'myPassword',
    ca: myCaFile
};
 
request.get(options);