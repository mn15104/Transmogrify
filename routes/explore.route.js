var express = require('express');
var router = express.Router();
var path = require('path');

var Explore = require('../models/explore.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/views/explore.html'));
});

router.get('/loadfiledata', function(req,res,next){
  var filedata = Explore.loadFileData(req,res);
})
router.get('/loadimagefile', function(req,res,next){
  var filedata = Explore.loadImageFile(req,res);
})
router.get('/loadaudiofile', function(req,res,next){
  var filedata = Explore.loadAudioFile(req,res);
})
module.exports = router;