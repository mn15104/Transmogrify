var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');

var Profile = require('../models/profile.model');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/../public/views/profile.html'));
    req.session.current_url = '/profile';
});

module.exports = router;