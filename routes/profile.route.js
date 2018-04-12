var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');

var Profile = require('../models/profile.model');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/../public/views/myprofile.html'));
    req.session.current_url = '/myprofile';
});
router.post('/loadmyprofile', function(req, res, next) {
    Profile.loadMyProfile(req, res);
});
module.exports = router;