'use strict';
var util = require('util');
var config = require('../config');
var sqlite3 = require('sqlite3');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var dateFormat = require('dateformat'); 
var crypto = require('crypto');
var async = require("async");

var Login = function (){

}

function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}
// **************************************************************************************************** //
let db = new sqlite3.Database('./Dev.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the Login db.');
});
// **************************************************************************************************** //
function asyncFunction(a, b, callback) {
	process.nextTick(function(){
		callback(null, a + b);
	})
}
Login.sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};
Login.genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

Login.saltHashPassword = function(userpassword, callback) {
    var salt = Login.genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = Login.sha512(userpassword, salt);
    console.log(passwordData)
    if(callback && typeof callback == 'function'){
        callback(passwordData['passwordHash'], passwordData['salt']);
    }
    else 
        return passwordData;
}

Login.loginRequest = function(req, res){
    var stmt = db.prepare("SELECT * FROM 'USER_LOGIN' WHERE email=(?)")
    stmt.get(req.body.email, function(err, row){
        if (err) throw err;
        if (!IS_NULL(row)){
            var user_id = row.user_id;
            var validate = Login.sha512(req.body.password, row.salt);
            var stmtb = db.prepare("SELECT password AS password FROM 'USER_LOGIN' WHERE password=(?)")
            stmtb.get(validate['passwordHash'], function(err, row){
                if(err) throw err;
                if (!IS_NULL(row)){
                    req.session.user_id = user_id;
                    res.status(200).send({ 
                        message: "Successful login",
                        user_id: user_id
                    });
                }
                else{
                    res.status(400).send({
                        message: 'Email Or Password Incorrect'
                    });
                }
            });
        }
        else {
            res.status(400).send({
                message: 'Email Or Password Incorrect'
            });
        }
    });
};

Login.accountRequest = function(req, res){
    
    var stmt = db.prepare("SELECT (email) FROM 'USER_LOGIN' WHERE email=(?)");
    stmt.get(req.body.email, function(err, row){
        if(err) throw err;
        if (IS_NULL(row)){
            db.get("SELECT COALESCE(MAX(user_id),0) AS max_user_id FROM USER_LOGIN", function(err, row){
                if(err) throw err;
                console.log(row);
                if(!IS_NULL(row)){
                    var user_id = parseInt(row.max_user_id) + 1;
                    Login.insertAccount(req, res, user_id);
                }
                else{
                    console.log("No error should occur here.");
                    throw err;
                }
            })
        }
        else {
            res.status(400).send({
                message: 'Email Address Exists'
            });
        }
    });
};

Login.insertAccount = function(req, res, user_id){
    var insert = function(sha, salt){ 
        var stmt = db.prepare("INSERT INTO USER_LOGIN (firstname, surname, email, user_id, password, salt) VALUES (?, ?, ?, ?, ?, ?)");
        stmt.get([req.body.firstname, req.body.surname, req.body.email, user_id, sha, salt], function(err, row){
        if(err) throw err;
        console.log(sha);
        var stmtb = db.prepare("INSERT INTO USER_PROFILE (user_id,occupation,description,profile_picture) VALUES (?,?,?,?)")
        stmtb.get([user_id, " ... ", " ... ", "../images/profile_pictures/profiledefault.png"], function(err, row){
            if(err) throw err;
            console.log("here");
            res.status(200).send({ 
                message: "Successful account creation" 
            });
        }) 
    })}
    var sha_pw = Login.saltHashPassword(req.body.password, insert);
    
}


module.exports = Login;