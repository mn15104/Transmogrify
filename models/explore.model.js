var util = require('util');
var config = require('../config');
var sqlite3 = require('sqlite3');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var dateFormat = require('dateformat'); 
var Explore = function (){

}

function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}

let db = new sqlite3.Database('./Dev.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});


Explore.getImageAudioPair = function(req, res){
    db.get("SELECT * FROM HOME_audio_files WHERE file_id='"+  req.body.file_id  + "'", function(err, row){
        if (err) throw err;
        if (!IS_NULL(row)){
            var audio = JSON.stringify(row);
            db.get("SELECT * FROM HOME_image_files WHERE file_id='"+  req.body.file_id  + "'", function(err, row){
                if (err) throw err;
                if (!IS_NULL(row)){
                    var image = JSON.stringify(row);
                    return [audio, image];
                }
            });
        }
    });
};

module.exports = Explore;