var util = require('util');
var config = require('../config');
var sqlite3 = require('sqlite3');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var dateFormat = require('dateformat'); 

var Create = function (){

}

function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}

// *************************************SQLITE INITIALISE****************************************************** //

let db = new sqlite3.Database('./Dev.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the Home file db.');
});

db.run(`CREATE TABLE IF NOT EXISTS CREATE_image_files (file_name VARCHAR(255), 
                                                     file_size VARCHAR(10), 
                                                     file_upload_date VARCHAR(255), 
                                                     file_id INT (100),
                                                     partner_id INT(100),
                                                     username VARCHAR(255),
                                                     FOREIGN KEY(partner_id) REFERENCES CREATE_audio_files(file_id),
                                                     PRIMARY KEY(file_id))`, (err) => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log("Table ready");
    }
});

db.run(`CREATE TABLE IF NOT EXISTS CREATE_audio_files (file_name VARCHAR(255), 
                                                     file_size VARCHAR(10), 
                                                     file_upload_date VARCHAR(255), 
                                                     file_id INT (100),
                                                     partner_id INT(100),
                                                     username VARCHAR(255),
                                                     FOREIGN KEY(partner_id) REFERENCES CREATE_image_files(file_id),
                                                     PRIMARY KEY(file_id))`, (err) => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log("Table ready");
    }
});

// **************************************************************************************************** //

Create.uploadFile = function(text, time) {
    var max_entry = 0;
    db.get("SELECT MAX(file_id) FROM CREATE_posts", function(err, row){
        if (err) throw err;
        if (IS_NULL(row)){
            console.log("1");
            var get_entry = parseInt(row.entry);
            max_entry = get_entry + 1;
            db.run("INSERT INTO CREATE_posts (post, entry, time) VALUES ('" + text + "', '" + max_entry + "', '" + time + "')", function (err, row){
                if (err) throw err;
                console.log("max entry is ", max_entry);
                console.log("Inserted into db");
            });
        }
        else{
            db.run("INSERT INTO CREATE_posts (post, entry, time) VALUES ('" + text + "', '" + max_entry + "', '" + time + "')", function (err, row){
                if (err) throw err;
                console.log("max entry is ", max_entry);
                console.log("Inserted into db");
            }); 
        }
    });
}

insertAudioToDB = function(file_name, file_size, file_upload_date, file_id, username){
    db.run("INSERT INTO CREATE_audio_files (file_name, file_size, file_upload_date, file_id) VALUES ('" 
                                        + file_name + "', '" + file_size + "', '" + file_upload_date + "', '" + file_id + "', '" + username + "')", function (err, row){
        if (err) throw err;
        console.log("Inserted into db");
    });
}
insertImageToDB = function(file_name, file_size, file_upload_date, file_id, username){
    db.run("INSERT INTO CREATE_image_files (file_name, file_size, file_upload_date, file_id) VALUES ('" 
                                        + file_name + "', '" + file_size + "', '" + file_upload_date + "', '" + file_id + "', '" + username +  "')", function (err, row){
        if (err) throw err;
        console.log("Inserted into db");
    });
}

createDate = function(){
    now = new Date(); 
    var date = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
    return date;
}

Create.uploadAudio = function(req, res, callback){

  var form = new formidable.IncomingForm();

  form.multiples = false;

  if (!fs.existsSync(path.join(__dirname, '../uploads/audio'))){
    fs.mkdirSync(path.join(__dirname, '../uploads/audio'));
  }
  form.uploadDir = path.join(__dirname, '../uploads/audio');

  form.on('file', function(field, file) {
    db.get("SELECT MAX(file_id) as max_id FROM CREATE_audio_files", function(err, row){
        if (err) throw err;
        console.log(row);
        var file_id = IS_NULL(row.max_id) ? 0 : row.max_id + 1;
        var file_id_str = file_id.toString();

        fs.mkdir(path.join(form.uploadDir, file_id_str), function(err){
            if(err) console.log('mkdir callback ', err);

            fs.rename(file.path, path.join(form.uploadDir, file_id_str, file.name), function (err) {
                if(err) console.log('rename callback ', err); 

                insertAudioToDB(file.name, file.size, createDate(), file_id, req.username);
            });
        });
    });
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occurred: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  form.parse(req);
}

Create.uploadImage = function(req, res, callback){

  var form = new formidable.IncomingForm();

  form.multiples = false;

  form.uploadDir = path.join(__dirname, '../uploads/images');

  form.on('file', function(field, file) {
    db.get("SELECT MAX(file_id) as max_id FROM CREATE_image_files", function(err, row){
        if (err) throw err;

        var file_id = IS_NULL(row.max_id) ? 0 : row.max_id + 1;
        var file_id_str = file_id.toString();

        fs.mkdir(path.join(form.uploadDir, file_id_str), function(err){
            if(err) console.log('mkdir callback ', err);

            fs.rename(file.path, path.join(form.uploadDir, file_id_str, file.name), function (err) {
                if(err) console.log('rename callback ', err); 
                
                insertImageToDB(file.name, file.size, createDate(), file_id, req.username);
            });
        });
    });
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occurred: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  form.parse(req);
}

Create.db = db;
Create.table = "CREATE_posts";
Create.table.format = "(post, entry, time)";


module.exports = Create;