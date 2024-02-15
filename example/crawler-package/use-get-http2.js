// https://spa16.scrape.center/

// 首页list接口 https://spa16.scrape.center/api/book/?limit=18&offset=0

const Crawler = require('crawler');

const c = new Crawler({
  maxConnections: 10,
  // This will be called for each crawled page
  callback: (error, res, done) => {
      if (error) {
          console.log(error);
      } else {
          const $ = res.$;
          // $ is Cheerio by default
          //a lean implementation of core jQuery designed specifically for the server
          console.log($('title').text());
      }
      done();
  }
});

c.queue([{
  uri: 'https://spa16.scrape.center/api/book/?limit=18&offset=0',
  method: 'GET',
  http2: true,
  // jQuery: false,

  // The global callback won't be called
  callback: (error, res, done) => {
      if (error) {
          console.log(error);
      } else {
          console.log('body', res.body);
          console.log('response', JSON.parse(res.body));
      }
      done();
  }
}]);
