var express = require('express');
var router = express.Router();
var path = require('path');


var Home = require('../models/home.model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname + '/../public/views/home.html'));
});

router.post('/getPost', function(req, res, next) {
    console.log("entry is" + req.body.entry);
      Home.getPost(req.body.entry, function(postObject, success){
                          if(success){
                            var postJSON = JSON.stringify(postObject);
                            res.send(postJSON); 
                          }
                          else{
                            res.send(204);
                          }
                        });
});

router.post('/post', function(req, res, next) {
  var post = req.body.user_post;
  Home.insert(post, new Date());
  res.redirect('/');
});



module.exports = router;