var util = require('util');
var config = require('../config');
var sqlite3 = require('sqlite3');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var dateFormat = require('dateformat'); 

var Login = function (){

}


function defaultContentTypeMiddleware (req, res, next) {
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
}

Login.submit = function(req){
    console.log(req.body);
}


module.exports = Login;