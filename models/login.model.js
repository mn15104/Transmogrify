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
// **************************************************************************************************** //
let db = new sqlite3.Database('./Dev.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the Login db.');
});

db.run(`CREATE TABLE IF NOT EXISTS USER_LOGIN       (firstname VARCHAR(255), 
                                                     surname VARCHAR(10), 
                                                     email VARCHAR(255), 
                                                     user_id INT (100),
                                                     password VARCHAR(255),
                                                     PRIMARY KEY(user_id))`, (err) => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log("Table ready");
    }
});

// **************************************************************************************************** //

Login.loginRequest = function(req, res){
    db.get("SELECT (email) FROM USER_LOGIN WHERE email='"+  req.body.email  + "'", function(err, row){
        if (err) throw err;
        if (!IS_NULL(row)){
            db.get("SELECT (password) FROM USER_LOGIN WHERE password='"+req.body.password+"'" , function(err, row){
                if(err) throw err;
                if (!IS_NULL(row)){
                    req.session.user_id = user_id;
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
    console.log(req.body);
        db.get("SELECT (email) FROM USER_LOGIN WHERE email='"+req.body.email+"'" , function(err, row){
            if(err) throw err;
            if (IS_NULL(row)){
                db.all("SELECT MAX (user_id) FROM USER_LOGIN", function(err, row){
                    if(err) throw err;
                    var user_id = 0;
                    if(!IS_NULL(row)){
                        user_id = parseInt(row) + 1;
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

insertAccount = function(req, res){
    db.get("INSERT INTO USER_LOGIN (firstname, surname, email, user_id,password) VALUES ('" + 
    req.body.firstname + "','" + req.body.surname + "','" + req.body.email + "','" + user_id + "','" + req.body.password + "')", function(err, row){
        if(err) throw err;

        res.sendStatus(200);
    }) 
}


module.exports = Login;