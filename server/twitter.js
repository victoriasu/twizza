// This file gets the twitter stream for pizza and sends it to the load balancer (does no processing)
var config = require('./../config.json');
var twitter = require('node-tweet-stream');
var request = require('request');
var fs = require('fs');

var stream = fs.createWriteStream('tweets.json');
var count = 0;

var tweetObj = {};
stream.once('open', function(fd) {
    t = new twitter({
        consumer_key: config.twitter_consumer_key,
        consumer_secret: config.twitter_consumer_secret,
        token: config.twitter_access_token_key,
        token_secret: config.twitter_access_token_secret
    })

    t.on('tweet', function (tweet) {
        console.log('tweet received', tweet);
        console.log('Count: ' + count);
        count++;

        // TODO: Send the tweet to the Load Balancer
        // The entire object or just the text, user.screen_name, and id_str
        // How do I send each time - request(tweet).pipe('pizza-tweets-854907392.us-west-2.elb.amazonaws.com:80/pizza')
        // Currently storing in tweets.json
        tweetObj[tweet.id_str] = {text: tweet.text, user: tweet.user.screen_name};    
        if (count >= 5) {
            stream.write(JSON.stringify(tweetObj));
            t.untrack('pizza');
            stream.end();
            
            fs.createReadStream('tweets.json').pipe(request.put('pizza-tweets-854907392.us-west-2.elb.amazonaws.com:80/'));
            // fs.readFile('tweets.json', 'utf8', function(err, contents) {
            //     console.log(contents);
            // });
        }
    })

    t.on('error', function (err) {
        console.log('Oh no');
    })

    t.track('pizza');
});