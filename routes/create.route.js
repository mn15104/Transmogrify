var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');


var Create = require('../models/create.model');

/* GET home page. */
// router.get('/home', function(req, res, next) {
//   res.sendFile(path.join(__dirname + '/../public/views/create_home.html'));
// });
router.get('/', function(req, res, next) {
  console.log("HEY");
  req.session.last_window = 'create';
  res.sendFile(path.join(__dirname + '/../public/views/create.html'));
});

router.post('/uploadaudio', function(req, res, next) {
  if(!IS_NULL(req.session.user_id))
  {
      Create.uploadAudio(req, res);
  }
  else{
      res.status(400);
      res.send('You Need To Be Logged In To Save Your Creations!');
  }  
});

router.post('/uploadimage', function(req, res, next) {
  if(!IS_NULL(req.session.user_id))
  {
      Create.uploadImage(req, res);
  }
  else{
      res.status(400);
      res.send('You Need To Be Logged In To Save Your Creations!');
  }  
});

function IS_NULL(x){
  return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}
module.exports = router;