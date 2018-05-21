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

router.post('/loadfile', function(req, res, next) {
    Profile.loadProfileFile(req, res);
});

router.post('/saveedit',function(req, res, next){
    console.log(req.body);
    Profile.saveEdit(req, res);
})

router.get('/', function(req, res, next) {

    req.session.last_window = 'myprofile';
    if(IS_NULL(req.session.user_id))
    {
        res.render('myprofile.ejs', 
        {   'firstname': 'firstname',
             'surname': 'surname',
             'email': 'email',
             'occupation':'occupation',
            'description':'description',
            'profile_picture':'profile_picture'
        });
        req.session.current_url = '/profile';
    }
    else 
    {
        console.log("ISN'T NULL");
        Profile.loadMyProfile(req, res, true);
    }
});

function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}

module.exports = router;