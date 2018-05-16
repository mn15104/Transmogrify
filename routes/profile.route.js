var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var Profile = require('../models/profile.model');


router.post('/loadmyprofile', function(req, res, next) {
    Profile.loadMyProfile(req, res);
});

router.post('/uploadprofilepicture', function(req, res, next) {
    Profile.uploadProfilePicture(req, res);
});

router.get('/', function(req, res, next) {
    console.log(req.session.user_id);
    if(IS_NULL(req.session.user_id))
    {
        console.log("IS NULL");
        res.sendFile(path.join(__dirname + '/../public/views/myprofile.html'));
        req.session.current_url = '/myprofile';
    }
    else 
    {
        console.log("ISN'T NULL");
        res.render('myprofile', 
        {   profile_image: '../images/profile_pictures/doggo_1526416712522.png',
            firstname:'', 
            surname: '',
            description: '',
            occupation: '',
            email:'',
        },
        function(err, html){
            res.send(html)
        } );
        req.session.current_url = '/myprofile';
    }
});

function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}

module.exports = router;