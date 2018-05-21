var express = require('express');
var router = express.Router();
var path = require('path');

var Explore = require('../models/explore.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.last_window = 'explore';
  res.sendFile(path.join(__dirname + '/../public/views/explore.html'));
});

router.post('/loadfile', function(req,res,next){
  console.log("here");
  Explore.loadFile(req,res);
})
module.exports = router;