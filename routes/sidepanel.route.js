var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');

var Sidepanel = require('../models/sidepanel.model');

router.get('/getProfilePicture', function(req, res, next) {
    Sidepanel.getProfilePicture(req,res);
});

router.get('/', function(req, res, next) {
    // if(!IS_NULL(req.session.user_id)){
    //     console.log("HEEYYY");
    //     res.redirect('/sidepanel?id=' + req.session.user_id);
    // }
    // else{
        res.sendFile(path.join(__dirname + '/../public/views/sidepanel.html'));
    // }
});


function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}
module.exports = router;