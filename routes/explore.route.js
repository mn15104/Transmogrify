var express = require('express');
var router = express.Router();
var path = require('path');

var Explore = require('../models/explore.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/views/explore.html'));
});

router.get('/loadfile', function(req,res,next){
  Explore.loadfile(req,res);
})

module.exports = router;