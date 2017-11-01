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
    // Get tweets
    async.parallel([
        function(callback) {
            pizzaTweetsCon.query({
                sql: "SELECT * from tweets ORDER BY id DESC LIMIT 100",
            }, function (error, results, fields) {
                if (error) console.log(error);
                if (error) throw error;
                str = getEmbedString(results);
                callback(null, str);
            });
        },
        function(callback) {
            // Get most used words of all time
            pizzaTweetsCon.query({
                sql: "SELECT * from wordcount ORDER BY count DESC LIMIT 10",
            }, function (error, results, fields) {
                if (error) console.log(error);
                if (error) throw error;
                callback(null, results);
            });
        },
        function(callback) {
            // Get most used words of recent
            pizzaTweetsCon.query({
                sql: "SELECT * from last100count ORDER BY count DESC LIMIT 10",
            }, function (error, results, fields) {
                if (error) console.log(error);
                if (error) throw error;
                callback(null, results);
            });
        }
    ], function(err, results) {
        if (err) return next(err);
        res.render('index', { title: 'Twizza', twitterResults: results[0], wordsAllTime: results[1], wordsRecent: results[2] });
    });
});


router.get('/:sentiment', function(req, res, next) {
    if (req.params.sentiment == 'positive') {
        // Get tweets
        async.parallel([
            function(callback) {
                pizzaTweetsCon.query({
                    sql: "SELECT * from tweets WHERE `tweets`.`sent` >= 0 ORDER BY id DESC LIMIT 100",
                }, function (error, results, fields) {
                    if (error) console.log(error);
                    if (error) throw error;
                    str = getEmbedString(results);
                    callback(null, str);
                });
            },
            function(callback) {
                // Get most used words of all time
                pizzaTweetsCon.query({
                    sql: "SELECT * from wordcount ORDER BY count DESC LIMIT 10",
                }, function (error, results, fields) {
                    if (error) console.log(error);
                    if (error) throw error;
                    callback(null, results);
                });
            },
            function(callback) {
                // Get most used words of recent
                pizzaTweetsCon.query({
                    sql: "SELECT * from last100count ORDER BY count DESC LIMIT 10",
                }, function (error, results, fields) {
                    if (error) console.log(error);
                    if (error) throw error;
                    callback(null, results);
                });
            }
        ], function(err, results) {
            if (err) return next(err);
            res.render('index', { title: 'Twizza', twitterResults: results[0], wordsAllTime: results[1], wordsRecent: results[2] });
        });
    }
    else if (req.params.sentiment == 'negative') {
        // Get tweets
        async.parallel([
            function(callback) {
                pizzaTweetsCon.query({
                    sql: "SELECT * from tweets WHERE `tweets`.`sent` < 0 ORDER BY id DESC LIMIT 100",
                }, function (error, results, fields) {
                    if (error) console.log(error);
                    if (error) throw error;
                    str = getEmbedString(results);
                    callback(null, str);
                });
            },
            function(callback) {
                // Get most used words of all time
                pizzaTweetsCon.query({
                    sql: "SELECT * from wordcount ORDER BY count DESC LIMIT 10",
                }, function (error, results, fields) {
                    if (error) console.log(error);
                    if (error) throw error;
                    callback(null, results);
                });
            },
            function(callback) {
                // Get most used words of recent
                pizzaTweetsCon.query({
                    sql: "SELECT * from last100count ORDER BY count DESC LIMIT 10",
                }, function (error, results, fields) {
                    if (error) console.log(error);
                    if (error) throw error;
                    callback(null, results);
                });
            }
        ], function(err, results) {
            if (err) return next(err);
            res.render('index', { title: 'Twizza', twitterResults: results[0], wordsAllTime: results[1], wordsRecent: results[2] });
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
