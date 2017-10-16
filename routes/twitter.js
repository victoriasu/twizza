var express = require('express');
var router = express.Router();

var twitter = require('twitter');
var config = require('./../config.json');

/* GET home page. */
router.get('/search/:searchTerm', function(req, res, next) {
  console.log("Here " + req.params.searchTerm);
  // store results
  //res.render('index', { results: 'CAB432 Assignment 2' });

});

module.exports = router;
