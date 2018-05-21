var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');

var Sidepanel = require('../models/sidepanel.model');
router.get('/', function(req, res, next) {
    if(IS_NULL(req.session.user_id)){
        res.redirect('/intro');
    }
    else{
        res.sendFile(path.join(__dirname + '/../public/views/sidepanel.html'));
    }
});

router.get('/getProfilePicture', function(req, res, next) {
    Sidepanel.getProfilePicture(req,res);
});

function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}
module.exports = router;
