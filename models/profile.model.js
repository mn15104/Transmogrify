var util = require('util');
var config = require('../config');
var sqlite3 = require('sqlite3');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var dateFormat = require('dateformat'); 
var Profile = function (){

}

function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}
let db = new sqlite3.Database('./Dev.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to Profile DB.');
});

db.run(`CREATE TABLE IF NOT EXISTS PROFILE_userinfo   ( firstname VARCHAR(255), 
                                                        surname VARCHAR(10), 
                                                        email VARCHAR(255), 
                                                        username INT (100),
                                                        occupation VARCHAR(255),
                                                        description VARCHAR(255),
                                                        PRIMARY KEY(username))`, (err) => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log("Table ready");
    }
});

Profile.loadProfile = function(req, res){
    var username = req.body.username;
    db.get("SELECT * FROM PROFILE_userinfo WHERE file_id='"+  username  + "'", function(err, row){
        if (err) throw err;
        if (!IS_NULL(row)){
            var stringrow = JSON.stringify(row);
            res.send(stringrow);
        }
    });
};

module.exports = Profile;