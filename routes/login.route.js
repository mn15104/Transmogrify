var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var Login = require('../models/login.model');

router.get('/', function(req, res, next) {

    res.sendFile(path.join(__dirname + '/../public/views/login.html'));
});

router.post('/submit', function(req, res, next) {
    Login.submit(req);
});




module.exports = router;