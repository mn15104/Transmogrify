var util = require('util');
var config = require('../config');
var sqlite3 = require('sqlite3');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var dateFormat = require('dateformat'); 

var Login = function (){

}

let db = new sqlite3.Database('./Dev.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS LOGIN_userdata   (username  VARCHAR(255), 
                                                     password  VARCHAR(10), 
                                                     email     VARCHAR(255), 
                                                     user_id    INT(100),
                                                     PRIMARY KEY(user_id))`, (err) => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log("User data table created");
    }
});

function defaultContentTypeMiddleware (req, res, next) {
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
}

Login.submit = function(req){
    console.log(req.body);
}


module.exports = Login;