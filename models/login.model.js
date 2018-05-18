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
// **************************************************************************************************** //

Login.loginRequest = function(req, res){
    db.get("SELECT * FROM 'USER_LOGIN' WHERE email='"+  req.body.email  + "'", function(err, row){
        if (err) throw err;
        if (!IS_NULL(row)){
            var user_id = row.user_id;
            db.get("SELECT (password) AS password FROM 'USER_LOGIN' WHERE password='"+req.body.password+"'" , function(err, row){
                if(err) throw err;
                if (!IS_NULL(row.password)){
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
    console.log( req.body.firstname + "','" + req.body.surname + "','" + req.body.email + "','" + req.body.password);
    db.get("SELECT (email) FROM 'USER_LOGIN' WHERE email='"+req.body.email+"'" , function(err, row){
        if(err) throw err;
        if (IS_NULL(row)){
            db.all("SELECT COALESCE(MAX(user_id),0) AS max_user_id FROM USER_LOGIN", function(err, row){
                if(err) throw err;
                if(!IS_NULL(row[0].max_user_id)){
                    console.log(row[0].max_user_id);
                    user_id = parseInt(row[0].max_user_id) + 1;
                    insertAccount(req, res, user_id);
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

insertAccount = function(req, res, user_id){
    db.get("INSERT INTO USER_LOGIN (firstname, surname, email, user_id, password) VALUES ('" + 
    req.body.firstname + "','" + req.body.surname + "','" + req.body.email + "','" + user_id + "','" + req.body.password + "')", function(err, row){
        if(err) throw err;
        db.get("INSERT INTO USER_PROFILE (user_id,occupation,description,profile_picture) VALUES ('" + 
        user_id + "','" + " ... " + "','" + " ... " + "','" + "../images/profile_pictures/profiledefault.png" + "')", function(err, row){
            if(err) throw err;
    
            res.status(200).send({ 
                message: "Successful account creation" 
            });
        }) 
    }) 
}


module.exports = Login;