var util = require('util');
var config = require('../config');
var sqlite3 = require('sqlite3');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var dateFormat = require('dateformat'); 
var async = require('async');

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
                var filePath = path.join(__dirname, '../audio/' + file_id + '/' + row.file_name);
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

Explore.loadFile = function(req, res){
        var pair_id     = req.body.pair_id;
        var num_files   = req.body.num_files;
        if(pair_id === 'max'){
            db.all("SELECT * FROM IMAGE_UPLOADS ORDER BY pair_id LIMIT '" + num_files + "'", function(err, row){
                if (err) console.log(err);
                image_data = row.map(img => {return {pair_id:   img.pair_id, 
                                                     file_path: img.file_path, 
                                                     user_id:   img.user_id, 
                                                     file_name: img.file_name}})
                                                     
                if (!IS_NULL(row)){
                    db.all("SELECT * FROM AUDIO_UPLOADS ORDER BY pair_id LIMIT '" + num_files + "'", function(err, row){
                        if(err) console.log(err);
                        file_data = row.map((aud,index) => {if(image_data.length < index + 1) return {};
                                                             file = aud;
                                                             file['file_path'] = image_data[index].file_path; 
                                                             file['file_name'] = image_data[index].file_name; 
                                                             return file;}).filter(
                                                             file_d => {return Object.keys(file_d).length !== 0;});
                        

                        async.forEachOf(file_data, function(file_d, i, inner_callback){
                            db.get("SELECT * FROM USER_PROFILE WHERE user_id='" + file_d.user_id + "'", function(err, row){
                                if(err) console.log(err);
                                if(!IS_NULL(row)){
                                    file_d['profile_picture'] = row.profile_picture;
                                    db.get("SELECT * FROM USER_LOGIN WHERE user_id='" + file_d.user_id + "'", function(err, row){
                                        if(err) console.log(err);
                                        file_d['firstname']       = row.firstname;
                                        file_d['surname']         = row.surname;
                                        inner_callback(null);
                                    })
                                }   
                                else{
                                    file_d['profile_picture'] = "not found"; 
                                    db.get("SELECT * FROM USER_LOGIN WHERE user_id='" + file_d.user_id + "'", function(err, row){
                                        if(err) console.log(err);
                                        file_d['firstname']       = row.firstname;
                                        file_d['surname']         = row.surname;
                                        inner_callback(null);
                                    })
                                }
                            });
                        }, function(err){
                            if(err) console.log(err);
                            console.log(file_data);
                            res.status(200).send(JSON.stringify(file_data));
                        })                                        
                                     
                    })
                }
                else{
                    res.status(400);
                    res.send('None shall pass');
                }
            });
        }
        else{
            db.all("SELECT * FROM IMAGE_UPLOADS WHERE pair_id <= " + pair_id + " ORDER BY pair_id LIMIT " + num_files, function(err, row){
                if (err) console.log(err);
                image_data = row.map(img => {return {pair_id:   img.pair_id, 
                                                     file_path: img.file_path, 
                                                     user_id:   img.user_id}})
                                                     
                if (!IS_NULL(row)){
                    db.all("SELECT * FROM AUDIO_UPLOADS WHERE pair_id <= " + pair_id + " ORDER BY pair_id LIMIT " + num_files, function(err, row){
                        if(err) console.log(err);
                        file_data = row.map((aud,index) => {if(image_data.length < index + 1) return {};
                                                             file = aud;
                                                             file['file_path'] = image_data[index].file_path; 
                                                             file['file_name'] = image_data[index].file_name; 
                                                             return file;}).filter(
                                                             file_d => {return Object.keys(file_d).length !== 0;});
                        

                        async.forEachOf(file_data, function(file_d, i, inner_callback){
                            db.get("SELECT * FROM USER_PROFILE WHERE user_id='" + file_d.user_id + "'", function(err, row){
                                if(err) console.log(err);
                                if(!IS_NULL(row)){
                                    file_d['profile_picture']   = row.profile_picture;
                                    file_d['firstname']         = row.firstname;
                                    file_d['surname']           = row.surname;
                                    inner_callback(null);
                                }   
                                else{
                                    file_d['profile_picture'] = "not found"; 
                                    file_d['firstname']         = row.firstname;
                                    file_d['surname']           = row.surname;
                                    inner_callback(null);
                                }
                            });
                        }, function(err){
                            if(err) console.log(err);
                            console.log(file_data);
                            res.status(200).send(JSON.stringify(file_data));
                        })                                        
                                     
                    })
                }
                else{
                    res.status(400);
                    res.send('None shall pass');
                }
            });
        }
};

Explore.loadProfileFile = function(req, res){
    var pair_id     = req.body.pair_id;
    var num_files   = req.body.num_files;
    if(IS_NULL(req.body.user_id))
        user_id  = req.session.user_id;
    else 
        user_id  = req.body.user_id;
    
    if(pair_id === 'max'){
        db.all("SELECT * FROM IMAGE_UPLOADS WHERE user_id='" +user_id + "' ORDER BY pair_id LIMIT '" + num_files + "'", function(err, row){
            if (err) console.log(err);
            image_data = row.map(img => {return {pair_id:   img.pair_id, 
                                                 file_path: img.file_path, 
                                                 user_id:   img.user_id, 
                                                 file_name: img.file_name}})
                                                 
            if (!IS_NULL(row)){
                db.all("SELECT * FROM AUDIO_UPLOADS WHERE user_id='" +user_id + "' ORDER BY pair_id LIMIT '" + num_files + "'", function(err, row){
                    if(err) console.log(err);
                    file_data = row.map((aud,index) => {if(image_data.length < index + 1) return {};
                                                         file = aud;
                                                         file['file_path'] = image_data[index].file_path; 
                                                         file['file_name'] = image_data[index].file_name; 
                                                         return file;}).filter(
                                                         file_d => {return Object.keys(file_d).length !== 0;});
                    

                    async.forEachOf(file_data, function(file_d, i, inner_callback){
                        db.get("SELECT * FROM USER_PROFILE WHERE user_id='" + user_id + "'", function(err, row){
                            if(err) console.log(err);
                            if(!IS_NULL(row)){
                                file_d['profile_picture'] = row.profile_picture;
                                db.get("SELECT * FROM USER_LOGIN WHERE user_id='" + user_id + "'", function(err, row){
                                    if(err) console.log(err);
                                    file_d['firstname']       = row.firstname;
                                    file_d['surname']         = row.surname;
                                    inner_callback(null);
                                })
                            }   
                            else{
                                file_d['profile_picture'] = "not found"; 
                                db.get("SELECT * FROM USER_LOGIN WHERE user_id='" + user_id + "'", function(err, row){
                                    if(err) console.log(err);
                                    file_d['firstname']       = row.firstname;
                                    file_d['surname']         = row.surname;
                                    inner_callback(null);
                                })
                            }
                        });
                    }, function(err){
                        if(err) console.log(err);
                        console.log(file_data);
                        res.status(200).send(JSON.stringify(file_data));
                    })                                        
                                 
                })
            }
            else{
                res.status(400);
                res.send('None shall pass');
            }
        });
    }
    else{
        db.all("SELECT * FROM IMAGE_UPLOADS WHERE user_id='" +  user_id + '" AND "'  + " pair_id <= " + pair_id + " ORDER BY pair_id LIMIT " + num_files, function(err, row){
            if (err) console.log(err);
            image_data = row.map(img => {return {pair_id:   img.pair_id, 
                                                 file_path: img.file_path, 
                                                 user_id:   img.user_id}})
                                                 
            if (!IS_NULL(row)){
                db.all("SELECT * FROM AUDIO_UPLOADS WHERE user_id='" +  user_id + '" AND "'  + " pair_id <= " + pair_id + " ORDER BY pair_id LIMIT " + num_files, function(err, row){
                    if(err) console.log(err);
                    file_data = row.map((aud,index) => {if(image_data.length < index + 1) return {};
                                                         file = aud;
                                                         file['file_path'] = image_data[index].file_path; 
                                                         file['file_name'] = image_data[index].file_name; 
                                                         return file;}).filter(
                                                         file_d => {return Object.keys(file_d).length !== 0;});
                    

                    async.forEachOf(file_data, function(file_d, i, inner_callback){
                        db.get("SELECT * FROM USER_PROFILE WHERE user_id='" + user_id + "'", function(err, row){
                            if(err) console.log(err);
                            if(!IS_NULL(row)){
                                file_d['profile_picture']   = row.profile_picture;
                                file_d['firstname']         = row.firstname;
                                file_d['surname']           = row.surname;
                                inner_callback(null);
                            }   
                            else{
                                file_d['profile_picture'] = "not found"; 
                                file_d['firstname']         = row.firstname;
                                file_d['surname']           = row.surname;
                                inner_callback(null);
                            }
                        });
                    }, function(err){
                        if(err) console.log(err);
                        console.log(file_data);
                        res.status(200).send(JSON.stringify(file_data));
                    })                                        
                                 
                })
            }
            else{
                res.status(400);
                res.send('None shall pass');
            }
        });
    }
};
module.exports = Explore;