var express = require('express');
var router = express.Router();

var twitter = require('twitter');
var config = require('./../config.json');

var sentiment = require('sentiment');
var twitterText = require('twitter-text');

var functionCalls = { positive: getPositiveTweets,
                      negative: getNegativeTweets,
                      all: getAllTweets
                    };

router.get('/:searchTerm', function(req, res, next) {
    var client = new twitter ({
        consumer_key: config.twitter_consumer_key,
        consumer_secret: config.twitter_consumer_secret,
        access_token_key: config.twitter_access_token_key,
        access_token_secret: config.twitter_access_token_secret
    });

    var search = 'https://api.twitter.com/1.1/search/tweets.json?q=url:'
               + req.params.searchTerm;
    
    client.get(search, function(error, tweets, response) {  
        if (!error) {
            for (var i = 0; i < tweets.statuses.length; i++) {
                let text = tweets.statuses[i].text;
                // Clean up text (remove mentions, hashtags and links)
                tweets.statuses[i].clean_text = removeLinks (text);
                // Get sentiment of cleaned text
                tweets.statuses[i].sentiment_value = sentiment(tweets.statuses[i].clean_text).score;
            }
            // Call pos, neg, or all function
            var embeddedStr = functionCalls[req.query.sentiment](tweets);
            res.render('index', { twitterResults: embeddedStr })
        }
    });
});

function removeLinks (text) {
    let mentions = twitterText.extractMentions(text);
    for (var i = 0; i < mentions.length; i++) {
        text = text.replace('@' + mentions[i], ' ');
    }
    let hashtags = twitterText.extractHashtags(text);
    for (var i = 0; i < mentions.length; i++) {
        text = text.replace('#' + hashtags[i], ' ');
    }
    let urls = twitterText.extractUrls(text);
    for (var i = 0; i < mentions.length; i++) {
        text = text.replace(urls[i], ' ');
    }
    return text;
}

function getPositiveTweets (tweets) {
    let str = ''; 
    for (var i = 0; i < tweets.statuses.length; i++) {
        if (tweets.statuses[i].sentiment_value >= 0) {
            str += getEmbedString(tweets.statuses[i]);
        }
    }
    return str;
}

function getNegativeTweets (tweets) {
    let str = ''; 
    for (var i = 0; i < tweets.statuses.length; i++) {
        if (tweets.statuses[i].sentiment_value < 0) {
            str += getEmbedString(tweets.statuses[i]);
        }
    }
    return str;
}

function getAllTweets (tweets) {
    let str = ''; 
    for (var i = 0; i < tweets.statuses.length; i++) {
        str += getEmbedString(tweets.statuses[i]);
    }
    return str;
}

function getEmbedString (tweet) {
    let str = '<blockquote class="twitter-tweet" data-lang="en">'
            +      '<a href="'
            +          'https://twitter.com/' + tweet.user.screen_name 
            +          '/status/' + tweet.id_str + '?ref_src=twsrc%5Etfw'
            +      '"></a>'
            +  '</blockquote> '
            +  '<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
    return str;
}

module.exports = router;
