// This file gets the twitter stream for pizza and sends it to the load balancer (does no processing)
var config = require('./../config.json');
var twitter = require('node-tweet-stream');
var request = require('request');
//var fs = require('fs');

//var stream = fs.createWriteStream('tweets.json');
var count = 0;

var tweetObj = {};
//stream.once('open', function(fd) {
    t = new twitter({
        consumer_key: config.twitter_consumer_key,
        consumer_secret: config.twitter_consumer_secret,
        token: config.twitter_access_token_key,
        token_secret: config.twitter_access_token_secret
    })

    // TODO: Not getting to index.js router.put ('sentiment') section
    // This might not be the right address (https or http?)
    //var url = 'https://pizza-tweets-854907392.us-west-2.elb.amazonaws.com:80/positive';
    //var url = 'http://pizza-tweets-854907392.us-west-2.elb.amazonaws.com/positive';
    // TODO: Load balancer not connected to instances or instances not healthys
    var url = 'http://54.245.40.52:3000/positive';
    
    t.on('tweet', function (tweet) {
        //console.log('tweet received', tweet);
        console.log('Count: ' + count);
        count++;
        // TODO: Send the tweet to the Load Balancer
        // The entire object or just the text, user.screen_name, and id_str
        //tweetObj[tweet.id_str] = {text: tweet.text, user: tweet.user.screen_name};    
        
        var options = {
          method: 'put',
          body: tweet,
          json: true,
          url: url
        }
        request(options, (err, res) => {
            if (err) { throw err; }
            //console.log(res);
        });

        if (count >= 50) {
            //stream.write(JSON.stringify(tweetObj));
            t.untrack('pizza');
            //stream.end();
            //fs.createReadStream('tweets.json').pipe(request.put('https://pizza-tweets-854907392.us-west-2.elb.amazonaws.com:80/positive'));
            // fs.readFile('tweets.json', 'utf8', function(err, contents) {
            //     console.log(contents);
            // });
        }
    })

    t.on('error', function (err) {
        console.log('ERROR: ' + err);
    })

    t.track('pizza');
//});