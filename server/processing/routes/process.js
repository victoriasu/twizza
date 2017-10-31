var express = require('express');
var router = express.Router();

var sentiment = require('sentiment');
var twitterText = require('twitter-text');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var nlp = require('compromise');

var config = require('./../../../config.json');
var mysql = require('mysql');
var pizzaTweetsCon = mysql.createConnection({
    host: 'pizzatweets.cfdpyrxr6oll.us-west-2.rds.amazonaws.com',
    user: config.mysqluser,
    password: config.mysqlpass,
    database: 'pizzatweets'
});

router.get('/', function(req, res, next) {
    pizzaTweetsCon.connect();
    console.log("Here");
    var embeddedStr = '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">5-year-old: We don&#39;t have pizza enough.<br><br>Me: We had it three days in a row.<br><br>5: I know.</p>&mdash; James Breakwell (@XplodingUnicorn) <a href="https://twitter.com/XplodingUnicorn/status/922829170664792064?ref_src=twsrc%5Etfw">October 24, 2017</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
    res.render('index', { title: 'Twizza', twitterResults: embeddedStr });
});

router.put('/:sentiment', function(req, res, next) {
    console.log("Sentiment: " + req.params.sentiment);
    var tweet = req.body;
    //console.log(tweet);

    // Clean up text (remove mentions, hashtags and links)
    tweet.clean_text = removeLinks (tweet.text);
    // Get sentiment of cleaned text
    tweet.sentiment_value = sentiment(tweet.clean_text).score;
    console.log(tweet);
    
    // Store tweet in database (table: tweets)
    var post = {id: null, twitterid: tweet.id, user: tweet.user, sent: tweet.sentiment_value};
    var query = pizzaTweetsCon.query('INSERT INTO `tweets` SET ?', post, function (error, results, fields) {
        if (error) console.log(error);
        if (error) throw error;
    });
    console.log(query.sql);
    
    // Store word count in database (table: wordcount)
    var tokenized = tokenizer.tokenize(tweet.clean_text);
    // Remove retweet indicator
    if (tokenized[0] === 'RT') {
        tokenized.splice(0, 1);
    }
    for (let i = 0; i < tokenized.length; i++) {
        pizzaTweetsCon.query({
            sql: "INSERT INTO `wordcount` (word, count) VALUES('" + tokenized[i] + "' ," + "1) ON DUPLICATE KEY UPDATE word = '" + tokenized[i] + "' , count = count + 1",
        }, function (error, results, fields) {
            if (error) console.log(error);
            if (error) throw error;
        });
    }

    // Do NLP
    console.log(tweet.clean_text);
    let getPeopleAndCounts = nlp(tweet.clean_text).people().out('freq');
    console.log(nlp(tweet.clean_text).sentences().toPastTense());
    console.log(getPeopleAndCounts);
    // End response or send success so that load balancer knows this instance is healthy
    res.end();
    // res.status(200);
});

function removeLinks (text) {
    var mentions = twitterText.extractMentions(text);
    for (var i = 0; i < mentions.length; i++) {
        text = text.replace('@' + mentions[i], ' ');
    }
    var hashtags = twitterText.extractHashtags(text);
    for (var i = 0; i < hashtags.length; i++) {
        text = text.replace('#' + hashtags[i], ' ');
    }
    var urls = twitterText.extractUrls(text);
    for (var i = 0; i < urls.length; i++) {
        text = text.replace(urls[i], ' ');
    }
    return text;
}

module.exports = router;