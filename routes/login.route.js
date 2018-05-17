var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');


var Login = require('../models/login.model');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/../public/views/login.html'));
    // req.session.current_url = '/login';
});

router.post('/submit_login', function(req, res, next) {
    Login.loginRequest(req, res, next);
});

router.post('/submit_account', function(req, res, next) {
    Login.accountRequest(req, res, next);
});

module.exports = router;
