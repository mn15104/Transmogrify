var util = require('util');
var config = require('../config');
var sqlite3 = require('sqlite3');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var SQL_MODEL = function(){

}
SQL_MODEL.init = function(){
    let db = new sqlite3.Database('./Dev.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('SQL init');
    });
    
    db.run(`CREATE TABLE IF NOT EXISTS USER_PROFILE       ( user_id INT (100),
                                                            occupation VARCHAR(255),
                                                            description VARCHAR(255),
                                                            profile_picture VARCHAR(255),
                                                            PRIMARY KEY(user_id), 
                                                            FOREIGN KEY(user_id) REFERENCES USER_LOGIN(user_id))`, (err) => {
        if (err) {
                console.error(err.message);
            }
        else {
            console.log("Table USER_PROFILE ready");
        }
    });


    db.run(`CREATE TABLE IF NOT EXISTS USER_LOGIN       (   firstname VARCHAR(255), 
                                                            surname VARCHAR(10), 
                                                            email VARCHAR(255), 
                                                            user_id INT (100),
                                                            password VARCHAR(255),
                                                            PRIMARY KEY(user_id))`, (err) => {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log("Table USER_LOGIN ready");
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
            console.log("Table USER_CHATHISTORY ready");
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
            console.log("Table USER_FRIENDS ready");
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS IMAGE_UPLOADS    (file_name VARCHAR(255), 
                                                        file_size VARCHAR(10), 
                                                        file_upload_date VARCHAR(255), 
                                                        file_id INT (100),
                                                        partner_id INT(100),
                                                        user_id VARCHAR(255),
                                                        FOREIGN KEY(partner_id) REFERENCES AUDIO_UPLOADS(file_id),
                                                        PRIMARY KEY(file_id))`, (err) => {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log("Table IMAGE_UPLOADS ready");
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS AUDIO_UPLOADS    (file_name VARCHAR(255), 
                                                        file_size VARCHAR(10), 
                                                        file_upload_date VARCHAR(255), 
                                                        file_id INT (100),
                                                        partner_id INT(100),
                                                        user_id VARCHAR(255),
                                                        FOREIGN KEY(partner_id) REFERENCES IMAGE_UPLOADS(file_id),
                                                        PRIMARY KEY(file_id))`, (err) => {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log("Table AUDIO_UPLOADS ready");
        }
    });

}
module.exports = SQL_MODEL;