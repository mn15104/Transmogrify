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
                                                            password VARCHAR(512),
                                                            salt    VARCHAR(255),
                                                            PRIMARY KEY(user_id))`, (err) => {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log("Table USER_LOGIN ready");
        }
    });


    db.run(`CREATE TABLE IF NOT EXISTS FRIENDLIST           (   user_idA INT (100), 
                                                                user_idB INT (100),
                                                                chat_id INT AUTO_INCREMENT NOT NULL,
                                                                PRIMARY KEY (user_idA, user_idB, chat_id))`, (err) => {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log("Table FRIENDLIST ready");
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS CHATMESSAGE           (  chat_id         INT (100),
                                                                message         VARCHAR(255),
                                                                time            datetime, 
                                                                user_send       INT(100),
                                                                user_receive    INT(100),
                                                                session_id      INT AUTO_INCREMENT NOT NULL,
                                                                PRIMARY KEY(session_id))`, (err) => {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log("Table MESSAGES ready");
        }
    });


    db.run(`CREATE TABLE IF NOT EXISTS IMAGE_UPLOADS    (user_id INT (100), 
                                                        pair_id INT (100), 
                                                        time datetime,
                                                        file_name VARCHAR(255),
                                                        file_path VARCHAR(255),
                                                        FOREIGN KEY(pair_id) REFERENCES AUDIO_UPLOADS(pair_id),
                                                        PRIMARY KEY(pair_id))`, (err) => {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log("Table IMAGE_UPLOADS ready");
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS AUDIO_UPLOADS    (user_id INT (100), 
                                                        pair_id INT (100), 
                                                        time datetime, 
                                                        primaryDetected INT(100), 
                                                        colourDetected INT(100), 
                                                        decision1 INT(100), 
                                                        decision2 INT(100), 
                                                        decision3 INT(100), 
                                                        decision4 INT(100), 
                                                        yClrSym INT(100), 
                                                        yFineSym INT(100), 
                                                        xClrSym INT(100), 
                                                        xFineSym INT(100),
                                                        FOREIGN KEY(pair_id) REFERENCES IMAGE_UPLOADS(pair_id)
                                                        PRIMARY KEY(pair_id))`, (err) => {
        if (err) {
            console.error(err.message);
        }
        else {
            console.log("Table AUDIO_UPLOADS ready");
        }
    });

}
module.exports = SQL_MODEL;