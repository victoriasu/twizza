// This file gets the twitter stream for pizza and sends it to the load balancer (does no processing)
var config = require('./../config.json');
var twitter = require('node-tweet-stream');
var request = require('request');

var count = 0;

t = new twitter({
    consumer_key: config.twitter_consumer_key,
    consumer_secret: config.twitter_consumer_secret,
    token: config.twitter_access_token_key,
    token_secret: config.twitter_access_token_secret
})

var url = 'http://elb-cab432-1649828362.us-west-2.elb.amazonaws.com/positive';
//var url = 'http://localhost:3000/positive';

var tweetToSend = {};

t.on('tweet', function (tweet) {
    // Send the tweet text, user.screen_name, and id_str to the Load Balancer
    tweetToSend = {id: tweet.id_str, user: tweet.user.screen_name, text: tweet.text};
    var options = {
        method: 'put',
        body: tweetToSend,
        json: true,
        url: url
    }
    request(options, (err, res) => {
        if (err) throw err;
        //console.log(res);
    });

    // if (count >= 50) {
    //     t.untrack('pizza');
    // }
})

t.on('error', function (err) {
    console.log('ERROR: ' + err);
})

t.track('pizza');