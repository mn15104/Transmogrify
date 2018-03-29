var util = require('util');
var config = require('../config');
var sqlite3 = require('sqlite3');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var dateFormat = require('dateformat'); 
var Login = function (){

}

function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}

let db = new sqlite3.Database('./Dev.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the Login db.');
});

db.run(`CREATE TABLE IF NOT EXISTS LOGIN_userinfo   (firstname VARCHAR(255), 
                                                     surname VARCHAR(10), 
                                                     email VARCHAR(255), 
                                                     username INT (100),
                                                     password VARCHAR(255),
                                                     PRIMARY KEY(username))`, (err) => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log("Table ready");
    }
});

Login.loginRequest = function(req, res){
    db.get("SELECT (username) FROM LOGIN_userinfo WHERE username='"+  req.body.username  + "'", function(err, row){
        if (err) throw err;
        if (!IS_NULL(row)){
            db.get("SELECT (password) FROM LOGIN_userinfo WHERE password='"+req.body.password+"'" , function(err, row){
                if (!IS_NULL(row)){
                    req.session.user = username;
                }
            });
        }
    });
};

Login.accountRequest = function(req, res){
    db.get("SELECT (username) FROM LOGIN_userinfo WHERE username='"+  req.body.username  + "'", function(err, row){
        if (err) throw err;
        if (IS_NULL(row)){
            db.get("SELECT (email) FROM LOGIN_userinfo WHERE email='"+req.body.email+"'" , function(err, row){
                if (IS_NULL(row)){
                    res.send("OK");
                }
            });

        }
    });
};

module.exports = Login;