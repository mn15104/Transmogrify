var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');

var Sidepanel = require('../models/sidepanel.model');

router.get('/getProfilePicture', function(req, res, next) {
    Sidepanel.getProfilePicture(req,res);
});

router.get('/', function(req, res, next) {
    //res.render(__dirname + "../public/views/sidepanel.html", {name:"name"});              <-- Only works on app.js for some reason
    res.sendFile(path.join(__dirname + '/../public/views/sidepanel.html'));
});
module.exports = router;