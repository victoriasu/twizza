var express = require('express');
var router = express.Router();

var sentiment = require('sentiment');
var twitterText = require('twitter-text');

router.get('/', function(req, res, next) { // Doesn't work with router.put
    // TODO: Loop through all tweets given
    // Or react each time new tweet received
    console.log("Here");
    console.log(req.body);
    // let text = req.body.tweet.text;
    // // Clean up text (remove mentions, hashtags and links)
    // tweet.clean_text = removeLinks (text);
    // // Get sentiment of cleaned text
    // tweet.sentiment_value = sentiment(tweet.clean_text).score;
    // // TODO: Store each tweet in DB
    // // TODO: Count words
    // // TODO: Store word counts in DB

    var embeddedStr = '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">5-year-old: We don&#39;t have pizza enough.<br><br>Me: We had it three days in a row.<br><br>5: I know.</p>&mdash; James Breakwell (@XplodingUnicorn) <a href="https://twitter.com/XplodingUnicorn/status/922829170664792064?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
    res.render('index', { title: 'Twizza', twitterResults: embeddedStr });
});

router.get('/:sentiment', function(req, res, next) {
    console.log(req.params.sentiment);
    var embeddedStr = '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I, literally, love pizza! When ordering <a href="https://twitter.com/PapaJohnsHousTx?ref_src=twsrc%5Etfw">@PapaJohnsHousTx</a> on game days, enter code ALTUVE for a chance to meet me! <a href="https://t.co/AWjRMjVXkH">pic.twitter.com/AWjRMjVXkH</a></p>&mdash; Jose Altuve (@JoseAltuve27) <a href="https://twitter.com/JoseAltuve27/status/922649377411420161?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
    // req.body
    // res.end();
    // res.status(200);
    res.render('index', { title: 'Twizza', twitterResults: embeddedStr });
});

function removeLinks (text) {
    var mentions = twitterText.extractMentions(text);
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

module.exports = router;