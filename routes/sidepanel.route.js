var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');

var Sidepanel = require('../models/sidepanel.model');

router.get('/getProfilePicture', function(req, res, next) {
    Sidepanel.getProfilePicture(req,res);
});

router.get('/', function(req, res, next) {

    // res.render('myprofile', { profile_image: '../images/profile_pictures/doggo_1526416712522.png',
    //     firstname:'', 
    //     surname: '',
    //     description: '',
    //     occupation: '',
    //     email:'',
    // });

    res.sendFile(path.join(__dirname + '/../public/views/sidepanel.html'));
});


function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}
module.exports = router;