const request = require('request')

// html
request('http://stackabuse.com', function(err, res, body) {
    console.log(body);
});
