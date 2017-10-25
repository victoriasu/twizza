var express = require('express');
var router = express.Router();

var config = require('./../config.json');

var sentiment = require('sentiment');
var twitterText = require('twitter-text');

var Twitter = require('node-tweet-stream');

var embeddedStr = '';
var count = 0;
router.get('/:searchTerm', function(req, res, next) {
    t = new Twitter({
        consumer_key: config.twitter_consumer_key,
        consumer_secret: config.twitter_consumer_secret,
        token: config.twitter_access_token_key,
        token_secret: config.twitter_access_token_secret
    })
    
    t.on('tweet', function (tweet) {
        //console.log('tweet received', tweet);
        console.log('Count: ' + count);

        let text = tweet.text;
        // Clean up text (remove mentions, hashtags and links)
        tweet.clean_text = removeLinks (text);
        // Get sentiment of cleaned text
        tweet.sentiment_value = sentiment(tweet.clean_text).score;

        // TODO: Tokenize tweet
        // TODO: Add to DB

        if (req.query.sentiment == 'positive' && tweet.sentiment_value >= 0) {
            count++;
            embeddedStr += getEmbedString(tweet);
        } else if (req.query.sentiment == 'negative' && tweet.sentiment_value < 0) {
            count++;
            embeddedStr += getEmbedString(tweet);
        } else if (req.query.sentiment == 'all') {
            count++;
            embeddedStr += getEmbedString(tweet);
        }
        
        if (count >= 500) {
            t.untrack('pizza');
            res.render('index', { twitterResults: embeddedStr });
        }
    })
    
    t.on('error', function (err) {
        console.log('Oh no');
    })
    
    t.track('pizza');
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
    let urlsa = twitterText.extractUrls(text);
    for (var i = 0; i < mentions.length; i++) {
        text = text.replace(urls[i], ' ');
    }
    return text;
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