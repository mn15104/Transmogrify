var express = require('express');
var router = express.Router();
var path = require('path');

var Explore = require('../models/explore.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/views/explore.html'));
});

router.get('/loadfiledatabyid', function(req,res,next){
  var filedata = Explore.loadFileDataByID(req,res);
})
router.get('/loadimagefilebyid', function(req,res,next){
  var filedata = Explore.loadImageFileByID(req,res);
})
router.get('/loadaudiofilebyid', function(req,res,next){
  var filedata = Explore.loadAudioFileByID(req,res);
})
module.exports = router;