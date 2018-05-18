var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');


var Create = require('../models/create.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/views/create.html'));
});

router.post('/uploadaudio', function(req, res, next) {
  Create.uploadAudio(req, res);
});

router.post('/uploadimage', function(req, res, next) {
  Create.uploadImage(req, res);
});


module.exports = router;