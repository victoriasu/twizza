var express = require('express');
var router = express.Router();

var twitter = require('twitter');
var config = require('./../config.json');

/* GET home page. */
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

            console.log(response);
            console.log("---------------------------------");
            console.log(tweets);

            // let str = '<blockquote class="twitter-tweet" data-lang="en">';
            //         + '<p lang="en" dir="ltr">'
            //         + 'Uvi 🍁 Just the thought of bananas makes me drool'
            //         + '<a href="https://twitter.com/hashtag/WWII?src=hash&amp;ref_src=twsrc%5Etfw">#WWII</a> '
            //         + '<a href="https://twitter.com/hashtag/RomanticSuspense?src=hash&amp;ref_src=twsrc%5Etfw">#RomanticSuspense</a>'
            //         + '<a href="https://t.co/fNvLdx9RLA">https://t.co/fNvLdx9RLA</a> … '
            //         + '<a href="https://t.co/SODc0Xasjm">pic.twitter.com/SODc0Xasjm</a>'
            //         + '</p>&mdash; Uvi Poznansky Author (@UviPoznansky)'
            //         + '<a href="https://twitter.com/UviPoznansky/status/916908399199178753?ref_src=twsrc%5Etfw">October 8, 2017</a>'
            //         + '</blockquote> '
            //         + '<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';

            //let str = '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/PlantBased?src=hash&amp;ref_src=twsrc%5Etfw">#PlantBased</a> sources of protein:<br>Tofu 🌱<br>Beans 🌰<br>Spinach 🌿<br>Soy meats 🍗<br>Nuts 🥜<br>Broccoli 🌳<br>Potatoes 🥔<a href="https://twitter.com/hashtag/ReasonsToGoVegan?src=hash&amp;ref_src=twsrc%5Etfw">#ReasonsToGoVegan</a></p>&mdash; PETA (@peta) <a href="https://twitter.com/peta/status/918975641399181315?ref_src=twsrc%5Etfw">October 13, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
            let str = '';

            

            for (var i = 0; i < tweets.statuses.length; i++) {
                console.log("ENTITIES");
                console.log(tweets.statuses[i].entities);
                console.log("METADATA");
                console.log(tweets.statuses[i].metadata);
                // text: tweets.statuses[i].text, 
                // entry: sentiment(tweets.statuses[i].text), 
                // favorites: tweets.statuses[i].favorite_count, 
                // retweets: tweets.statuses[i].retweet_count 

                str = '<blockquote class="twitter-tweet" data-lang="en">';
                    + '<p lang="en" dir="ltr">'
                    + 'Uvi 🍁 Just the thought of bananas makes me drool';
                if (tweets.statuses[i].entities.hashtags.length > 0) {
                    for (var j = 0; j < tweets.statuses[i].entities.hashtags.length; j++) {
                        str += '<a href="https://twitter.com/hashtag/' + tweets.statuses[i].entities.hashtags[j].text + '?src=hash&amp;ref_src=twsrc%5Etfw">#' + tweets.statuses[i].entities.hashtags[j].text + '</a> '
                    }
                }
                console.log("MEDIA");
                console.log(tweets.statuses[i].entities.urls);
                str += '<a href="https://t.co/fNvLdx9RLA">https://t.co/fNvLdx9RLA</a> … '
                    + '<a href="https://t.co/SODc0Xasjm">pic.twitter.com/SODc0Xasjm</a>'
                    + '</p>&mdash;'
                    + tweets.statuses[i].user.name + ' (@' + tweets.statuses[i].user.screen_name + ')'
                    + '<a href="' + tweets.statuses[i].entities.urls.expanded_url + '">October 8, 2017</a>' //+ '<a href="https://twitter.com/UviPoznansky/status/916908399199178753?ref_src=twsrc%5Etfw">October 8, 2017</a>'
                    + '</blockquote> '
                    + '<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
            }
            res.render('index', { twitterResults: str })
        }
    });
});

module.exports = router;
