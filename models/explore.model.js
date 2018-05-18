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

// **************************************************************************************************** //
let db = new sqlite3.Database('./Dev.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the Explore db.');
});

// **************************************************************************************************** //

Explore.loadAudioFileByID = function(req, res){
        var file_id = req.body.file_id;
        db.get("SELECT * FROM AUDIO_UPLOADS WHERE file_id='"+  file_id  + "'", function(err, row){
            if (err) throw err;
            if (!IS_NULL(row)){
                var filePath = path.join(__dirname, '../uploads/audio/' + file_id + '/' + row.file_name);
                var stat = fileSystem.statSync(filePath);
                res.writeHead(200, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': stat.size
                });
                var readStream = fileSystem.createReadStream(filePath);
                // We replaced all the event handlers with a simple call to readStream.pipe()
                readStream.pipe(res);        
            }
            else{
                res.status(400);
                res.send('None shall pass');
            }
        });
    
  
};

Explore.loadImageFileByID = function(req, res){
   
        var file_id = req.body.file_id;
        db.get("SELECT * FROM IMAGE_UPLOADS WHERE file_id='"+  file_id  + "'", function(err, row){
            if (err) throw err;
            if (!IS_NULL(row)){
                var filePath = path.join(__dirname, '../uploads/image/' + file_id + '/' + row.file_name);
                res.send(filepath);      
            }
            else{
                res.status(400);
                res.send('None shall pass');
            }
        });
};


module.exports = Explore;