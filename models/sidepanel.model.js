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

db.run(`CREATE TABLE IF NOT EXISTS PROFILE_userinfo   ( firstname VARCHAR(255), 
                                                        surname VARCHAR(10), 
                                                        email VARCHAR(255), 
                                                        user_id INT (100),
                                                        occupation VARCHAR(255),
                                                        description VARCHAR(255),
                                                        PRIMARY KEY(user_id))`, (err) => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log("Table ready");
    }
});

db.run(`CREATE TABLE IF NOT EXISTS PROFILE_chathistory   (  user_idA INT (100), 
                                                            user_idB INT (100), 
                                                            message     VARCHAR(555), 
                                                            date        datetime
                                                            id          INT (100),
                                                            UNIQUE(user_idA, user_idB))`, (err) => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log("Table ready");
    }
});

// **************************************************************************************************** //

Sidepanel.getProfilePicture = function(req,res){
    var myfiles=fs.readFileSync("../uploads/profile_images/ting.jpg");
    console.log(myfiles);
    console.log("myfiles");
    res.sendFile("../uploads/profile_images/ting.jpg");
}

module.exports = Sidepanel;