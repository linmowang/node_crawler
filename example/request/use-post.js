const request = require('request')

// html post 
const options = {
  url: 'http://http://mockbin.com/request',
  form: {
      email: 'me@example.com',
      password: 'myPassword'
  }
};


request.post(options, function(err, res, body) {
  // let json = JSON.parse(body);
  console.log(body);
})