// https://spa16.scrape.center/

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
          console.log('title: ', $('title').text());
      }
      done();
  }
});

c.queue([{
  uri: 'https://spa16.scrape.center/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  },
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
