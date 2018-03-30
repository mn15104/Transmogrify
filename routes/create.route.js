var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');


var Create = require('../models/create.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/views/create.html'));
});

router.get('/drag', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/views/drag.html'));
});

router.post('/drag/uploadAudio', function(req, res, next) {
  Create.uploadAudio(req, res, next);
});

router.post('/post', function(req, res, next) {
  var post = req.body.user_post;
  Create.uploadFile(post, new Date());
  res.redirect('/');
});



module.exports = router;