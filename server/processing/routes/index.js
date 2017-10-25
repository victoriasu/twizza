var express = require('express');
var router = express.Router();

var sentiment = require('sentiment');
var twitterText = require('twitter-text');

router.get('/', function(req, res, next) { // Doesn't work with router.put
    console.log("Here");
    var embeddedStr = '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">5-year-old: We don&#39;t have pizza enough.<br><br>Me: We had it three days in a row.<br><br>5: I know.</p>&mdash; James Breakwell (@XplodingUnicorn) <a href="https://twitter.com/XplodingUnicorn/status/922829170664792064?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
    res.render('index', { title: 'Twizza', twitterResults: embeddedStr });
});

router.put('/:sentiment', function(req, res, next) {
    console.log("Sentiment: " + req.params.sentiment);
    var tweet = {};
    tweet.text = req.body.text;
    // Clean up text (remove mentions, hashtags and links)
    tweet.clean_text = removeLinks (tweet.text);
    // Get sentiment of cleaned text
    tweet.sentiment_value = sentiment(tweet.clean_text).score;

    // TODO: Store each tweet in DB
    // TODO: Count words
    // TODO: Store word counts in DB

    console.log(tweet);
    res.end(); // instead of res.render();
    // res.status(200);
});

function removeLinks (text) {
    var mentions = twitterText.extractMentions(text);
    for (var i = 0; i < mentions.length; i++) {
        text = text.replace('@' + mentions[i], ' ');
    }
    var hashtags = twitterText.extractHashtags(text);
    for (var i = 0; i < mentions.length; i++) {
        text = text.replace('#' + hashtags[i], ' ');
    }
    var urls = twitterText.extractUrls(text);
    for (var i = 0; i < mentions.length; i++) {
        text = text.replace(urls[i], ' ');
    }
    return text;
}

module.exports = router;