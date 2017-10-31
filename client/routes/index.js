var express = require('express');
var router = express.Router();
var async = require('async');

var config = require('./../../config.json');
var mysql = require('mysql');
var pizzaTweetsCon = mysql.createConnection({
    host: 'pizzatweets.cfdpyrxr6oll.us-west-2.rds.amazonaws.com',
    user: config.mysqluser,
    password: config.mysqlpass,
    database: 'pizzatweets'
});

router.get('/', function(req, res, next) {
    // Display tweets
    let str = '';
    let words = null;
    async.parallel([
        function(callback) {
            pizzaTweetsCon.query({
                sql: "SELECT * from tweets ORDER BY id DESC LIMIT 100",
            }, function (error, results, fields) {
                if (error) console.log(error);
                if (error) throw error;
                str = getEmbedString(results);
                callback();
            });
        },
        function(callback) {
            // Display words
            pizzaTweetsCon.query({
                sql: "SELECT * from wordcount ORDER BY count DESC LIMIT 10",
            }, function (error, results, fields) {
                if (error) console.log(error);
                if (error) throw error;
                words = results;
                callback();
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.render('index', { title: 'Twizza', twitterResults: str, frequentWords: words });
    });
});


router.get('/:sentiment', function(req, res, next) {
    if (req.params.sentiment == 'positive') {
        // Display tweets
        let str = '';
        let words = null;
        async.parallel([
            function(callback) {
                pizzaTweetsCon.query({
                    sql: "SELECT * from tweets WHERE `tweets`.`sent` >= 0 ORDER BY id DESC LIMIT 100",
                }, function (error, results, fields) {
                    if (error) console.log(error);
                    if (error) throw error;
                    str = getEmbedString(results);
                    callback();
                });
            },
            function(callback) {
                // Display words
                pizzaTweetsCon.query({
                    sql: "SELECT * from wordcount ORDER BY count DESC LIMIT 10",
                }, function (error, results, fields) {
                    if (error) console.log(error);
                    if (error) throw error;
                    words = results;
                    callback();
                });
            }
        ], function(err) {
            if (err) return next(err);
            res.render('index', { title: 'Twizza', twitterResults: str, frequentWords: words });
        });
    }
    else if (req.params.sentiment == 'negative') {
        // Display tweets
        let str = '';
        let words = null;
        async.parallel([
            function(callback) {
                pizzaTweetsCon.query({
                    sql: "SELECT * from tweets ORDER BY id DESC LIMIT 100 WHERE `tweets`.`sent` < 0",
                }, function (error, results, fields) {
                    if (error) console.log(error);
                    if (error) throw error;
                    str = getEmbedString(results);
                    callback();
                });
            },
            function(callback) {
                // Display words
                pizzaTweetsCon.query({
                    sql: "SELECT * from wordcount ORDER BY count DESC LIMIT 10",
                }, function (error, results, fields) {
                    if (error) console.log(error);
                    if (error) throw error;
                    words = results;
                    callback();
                });
            }
        ], function(err) {
            if (err) return next(err);
            res.render('index', { title: 'Twizza', twitterResults: str, frequentWords: words });
        });
    }
});

function getEmbedString (results) {
    let str = '';
    for (let i = 0; i < results.length; i++) {
        str += '<blockquote class="twitter-tweet" data-lang="en">'
        + '<a href="'
        + 'https://twitter.com/' + results[i].user 
        + '/status/' + results[i].twitterid + '?ref_src=twsrc%5Etfw'
        + '"></a>'
        + '</blockquote> '
        + '<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
    }
    return str;
}

module.exports = router;
