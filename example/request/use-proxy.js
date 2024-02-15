let options = {
  url: 'https://www.google.com',
  proxy: 'http://myproxy.com'
};

request(options, function(err, res, body) {
  // let json = JSON.parse(body);
  console.log(body);
})