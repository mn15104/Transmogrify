var util = require('util');
var config = require('../config');
var sqlite3 = require('sqlite3');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var dateFormat = require('dateformat');
 

var Sidepanel = function (){

}

function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}

// **************************************************************************************************** //
let db = new sqlite3.Database('./Dev.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to Profile DB.');
});


// **************************************************************************************************** //

Sidepanel.getProfilePicture = function(req,res){
    var myfiles=fs.readFileSync("../uploads/profile_images/ting.jpg");
    console.log(myfiles);
    console.log("myfiles");
    res.sendFile("../uploads/profile_images/ting.jpg");
}

module.exports = Sidepanel;