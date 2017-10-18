var express = require('express');
var router = express.Router();

var twitter = require('twitter');
var config = require('./../config.json');

var sentiment = require('sentiment');
var twitterText = require('twitter-text');

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
            let str = ''; 
            for (var i = 0; i < tweets.statuses.length; i++) {
                str += '<blockquote class="twitter-tweet" data-lang="en">'
                    +      '<a href="'
                    +          'https://twitter.com/' + tweets.statuses[i].user.screen_name 
                    +          '/status/' + tweets.statuses[i].id_str + '?ref_src=twsrc%5Etfw'
                    +      '"></a>'
                    +  '</blockquote> '
                    +  '<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';

                    console.log(twitterText.extractMentions(tweets.statuses[i].text));
            }
            res.render('index', { twitterResults: str })
        }
    });
});

function removeLinks () {

}

module.exports = router;
