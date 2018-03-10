var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');


var Home = require('../models/home.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  // if(req.session.current_url != '/sidebar')
  // name = "home.html";
  res.sendFile(path.join(__dirname + '/../public/views/home.html'));
});

router.get('/drag', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/views/drag.html'));
});

router.post('/drag/uploadAudio', function(req, res, next) {
      Home.uploadAudio(req, res, next);
});

router.post('/post', function(req, res, next) {
  var post = req.body.user_post;
  Home.insert(post, new Date());
  res.redirect('/');
});



module.exports = router;