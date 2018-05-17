var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var Profile = require('../models/profile.model');





router.get('/', function(req, res, next) {

    if(IS_NULL(req.query.user_id))
    {
        res.render('profile.ejs', 
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
        Profile.loadOtherProfile(req, res, true);
    }
});

function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}

module.exports = router;