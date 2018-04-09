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

// **************************************************************************************************** //
let db = new sqlite3.Database('./Dev.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to Profile DB.');
});

db.run(`CREATE TABLE IF NOT EXISTS USER_PROFILE       ( firstname VARCHAR(255), 
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

db.run(`CREATE TABLE IF NOT EXISTS USER_CHATHISTORY      (  user_idA INT (100), 
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

db.run(`CREATE TABLE IF NOT EXISTS USER_FRIENDS          (  user_idA INT (100), 
                                                            user_idB INT (100),
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

Profile.loadProfile = function(req, res){
    var user_id = req.body.user_id;
    db.get("SELECT * FROM USER_PROFILE WHERE file_id='"+  user_id  + "'", function(err, row){
        if (err) throw err;
        if (!IS_NULL(row)){
            var stringrow = JSON.stringify(row);
            res.send(stringrow);
        }
    });
};

Profile.loadChatHistory = function(req, res){
    var other_user_id = req.body.user_id;
    var user_id = req.session.user_id;
    var messages = [];
    var counter = 0;
    db.all("SELECT * FROM USER_CHATHISTORY WHERE user_idA='"+  user_id  + "' OR '" + other_user_id
            + " AND user_idB = '" + user_id + "' OR '" + otheruser_id + "' ORDER BY id DESC LIMIT 20", (err, rows) => {
                if (err) throw err;
                counter = rows.length;
                rows.forEach((row) => {
                    if(!IS_NULL(row)){
                        var str_row = JSON.stringify(row);
                        messages.push(str_row);
                        counter  = counter - 1;
                    }
                    if(counter === 0) {
                        var str_messages = JSON.stringify(messages);
                        res.send(str_messages);
                    }
                })
            });
    
}

module.exports = Profile;