var express = require('express');
var router = express.Router();
var async = require('async');

var sentiment = require('sentiment');
var twitterText = require('twitter-text');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
//var nlp = require('compromise');

var tweetCount = 0;
var tweets = [];
var words = {};
var totalWords100 = 0;

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
    var tweet = req.body;
    tweetCount++;
    console.log('tweetCount = ' + tweetCount);

    // Clean up text (remove mentions, hashtags and links)
    tweet.clean_text = removeLinks (tweet.text);
    //console.log('clean text: ' + tweet.clean_text);

    // Get sentiment of cleaned text
    tweet.sentiment_value = sentiment(tweet.clean_text).score;
    
    // Store tweet in database (table: tweets)
    var post = {id: null, twitterid: tweet.id, user: tweet.user, sent: tweet.sentiment_value};
    var query = pizzaTweetsCon.query('INSERT INTO `tweets` SET ?', post, function (error, results, fields) {
        if (error) console.log(error);
        if (error) throw error;
    });
    console.log(query.sql);
    
    tweets.push(tweet);

    if (tweetCount % 10 === 0) {
        console.log('tweetCount % 10 === 0');
        console.log('There are ' + tweets.length + ' tweets');
        async.series([
            function(callback) {
                totalWords100 = 0;
                // Clear the previous 100 tweets' data from last100count table
                pizzaTweetsCon.query({
                    sql: "TRUNCATE TABLE last100count",
                }, function (error, results, fields) {
                    if (error) console.log(error);
                    if (error) throw error;
                    console.log('Table has been truncated');
                    callback();
                });
            },
            function(callback) {
                console.log('Time to loop');
                for (let t = 0; t < tweets.length; t++) {
                    // Loop through words in this tweet and update words dictionary
                    var tokenized = tokenizer.tokenize(tweets[t].clean_text);
                    // Remove retweet indicator
                    if (tokenized[0] === 'RT') {
                        tokenized.splice(0, 1);
                    }
                    for (let j = 0; j < tokenized.length; j++) {
                        totalWords100++;
                        if (words.hasOwnProperty(tokenized[j])) {
                            words[tokenized[j]][0]++;
                        }
                        else {
                            words[tokenized[j]] = [1, 0];
                        }
                        // Update wordcount table with tokenised words and their count
                        pizzaTweetsCon.query({
                            sql: "INSERT INTO `wordcount` (word, count) VALUES('" + tokenized[j] + "' ," + "1) ON DUPLICATE KEY UPDATE word = '" + tokenized[j] + "' , count = count + 1",
                        }, function (error, results, fields) {
                            if (error) console.log(error);
                            if (error) throw error;
                        });
                    }
                    console.log('t = ' + t);
                }
                callback();
            },
            function(callback) {
                console.log("Number of words: " + totalWords100);
                for (var word in words) {
                    async.series([
                        function(callback) {
                            // Calculate percentage of word occurrence in last 100 tweets
                            words[word][1] = words[word][0] / totalWords100;
                            console.log('percent = ' + words[word][0] + '/' + totalWords100 + ' = ' + words[word][1]);
                            console.log('word: ' + word);
                            callback();
                        },
                        function(callback) {
                            // Store this into database
                            pizzaTweetsCon.query({
                                sql: "INSERT INTO `last100count` (word, count, percent) VALUES('" + word + "' ," 
                                    + words[word][0] + " ," + words[word][1] + ") ON DUPLICATE KEY UPDATE word = '" + word 
                                    + "' , count = count + " + words[word][0] + ", percent = percent + " + words[word][1],
                            }, function (error, results, fields) {
                                if (error) console.log(error);
                                if (error) throw error;
                                console.log(fields);
                                console.log(results);
                                callback();
                            });
                        }
                    ]);
                }
            }
        ],
        function(err, results) {
            if (error) console.log(error);
            console.log('async done');
        });
    }
    // Do NLP
    // console.log(tweet.clean_text);
    // let getPeopleAndCounts = nlp(tweet.clean_text).people().out('freq');
    // console.log(nlp(tweet.clean_text).sentences().toPastTense());
    // console.log(getPeopleAndCounts);
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