const request = require('request')

request('https://jsonplaceholder.typicode.com/todos/1', function(err, res, body) {
    if(err) console.log('err:', err);
    console.log(body);
});
