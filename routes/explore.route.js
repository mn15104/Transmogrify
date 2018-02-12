var express = require('express');
var router = express.Router();
var path = require('path');

// var Explore = require('../models/home.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/views/explore.html'));
});



module.exports = router;