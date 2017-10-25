var express = require('express');
var router = express.Router();

var config = require('./../config.json');

router.get('/:sentiment', function(req, res, next) {
    // Get from database
    res.render('index', { title: 'Twizza' });
});

module.exports = router;