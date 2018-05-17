var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var Profile = require('../models/profile.model');





router.get('/', function(req, res, next) {

    if(IS_NULL(req.query.user_id))
    {
        console.log("IS NULL");
        res.sendFile(path.join(__dirname + '/../public/views/profile.html'));
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