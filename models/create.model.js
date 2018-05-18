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
// **************************************************************************************************** //

insertAudioToDB = function(file_name, file_size, file_upload_date, file_id, user_id){
    db.run("INSERT INTO AUDIO_UPLOADS (file_name, file_size, file_upload_date, file_id) VALUES ('" 
                                        + file_name + "', '" + file_size + "', '" + file_upload_date + "', '" + file_id + "', '" + user_id + "')", function (err, row){
        if (err) throw err;
        console.log("Inserted into db");
    });
}
insertImageToDB = function(file_name, file_size, file_upload_date, file_id, user_id){
    db.run("INSERT INTO IMAGE_UPLOADS (file_name, file_size, file_upload_date, file_id) VALUES ('" 
                                        + file_name + "', '" + file_size + "', '" + file_upload_date + "', '" + file_id + "', '" + user_id +  "')", function (err, row){
        if (err) throw err;
        console.log("Inserted into db");
    });
}

createDate = function(){
    now = new Date(); 
    var date = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
    return date;
}

Create.uploadAudio = function(req, res){
    aud_vars = req.body;
    // console.log(req.body);
    db.get("SELECT MAX(pair_id) AS pair_id FROM AUDIO_UPLOADS", function(err,row){
        if(IS_NULL(row.pair_id)){
            pair_id = 0;
            time = createDate();
            db.get("INSERT INTO AUDIO_UPLOADS (user_id, pair_id, time, primaryDetected, colourDetected, decision1, decision2, decision3, decision4, yClrSym, yFineSym, xClrSym, xFineSym)" + 
            "VALUES ('" +    req.session.user_id + "','" + pair_id + "','" + time + "','"  + aud_vars.primaryDetected + "','" + aud_vars.colourDetected + "','" + 
                             aud_vars.decision1  + "','" + aud_vars.decision2   + "','" + aud_vars.decision3       + "','" + aud_vars.decision4      + "','" + 
                             aud_vars.yClrSym    + "','" + aud_vars.yFineSym    + "','" + aud_vars.xClrSym         + "','" + aud_vars.xFineSym + "')"  )
        }
        else {
            pair_id = row.pair_id + 1;
            time = createDate();
            db.get("INSERT INTO AUDIO_UPLOADS (user_id, pair_id, time, primaryDetected, colourDetected, decision1, decision2, decision3, decision4, yClrSym, yFineSym, xClrSym, xFineSym)" + 
            "VALUES ('" +    req.session.user_id + "','" + pair_id + "','" + time + "','"  + aud_vars.primaryDetected + "','" + aud_vars.colourDetected + "','" + 
                             aud_vars.decision1  + "','" + aud_vars.decision2   + "','" + aud_vars.decision3       + "','" + aud_vars.decision4      + "','" + 
                             aud_vars.yClrSym    + "','" + aud_vars.yFineSym    + "','" + aud_vars.xClrSym         + "','" + aud_vars.xFineSym + "')"  )
        }
    })
}

Create.uploadImage = function(req, res, callback){
    var form = new formidable.IncomingForm()
    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = path.join(__dirname, '../uploads/images');
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(500).json({ error: err })
        res.status(200).json({ uploaded: true })
    });
    form.on('fileBegin', function (name, file) {
        const [fileName, fileExt] = file.name.split('.');
        console.log(file);
        file.path = path.join( path.join(__dirname, '../uploads/images')
                                , `${fileName}_${new Date().getTime()}.${fileExt}`);
        relative_file_path = '/../../uploads/images/' + `${fileName}_${new Date().getTime()}.${fileExt}`;

        user_id = req.session.user_id;
        time = Create.createDate();

        db.get("SELECT MAX(pair_id) AS pair_id FROM IMAGE_UPLOADS", function(err,row){
            if(IS_NULL(row)){
                pair_id = 0;
                insertImage(user_id, pair_id, time, fileName, relative_file_path);
            }
            else{
                img_pair_id = row.pair_id + 1;
                insertImage(user_id, img_pair_id, time, fileName, relative_file_path);
            }
        })
    });



    var insertImage = function( user_id, pair_id, time, file_name, file_path){
        db.get("INSERT INTO IMAGE_UPLOADS (user_id, pair_id, time, file_name, file_path) VALUES ('" + 
                                                    user_id + "','" + pair_id + "','" + time  + "','" + file_name + "','" + file_path + "')", function(err, row){
                                                        console.log(err);
                                                })
    }
}


Create.uploadAudioFile = function(req, res, callback){

  var form = new formidable.IncomingForm();

  form.multiples = false;

  if (!fs.existsSync(path.join(__dirname, '../uploads/audio'))){
    fs.mkdirSync(path.join(__dirname, '../uploads/audio'));
  }
  form.uploadDir = path.join(__dirname, '../uploads/audio');

  form.on('file', function(field, file) {
    db.get("SELECT MAX(file_id) as max_id FROM AUDIO_UPLOADS", function(err, row){
        if (err) throw err;
        console.log(row);
        var file_id = IS_NULL(row.max_id) ? 0 : row.max_id + 1;
        var file_id_str = file_id.toString();

        fs.mkdir(path.join(form.uploadDir, file_id_str), function(err){
            if(err) console.log('mkdir callback ', err);

            fs.rename(file.path, path.join(form.uploadDir, file_id_str, file.name), function (err) {
                if(err) console.log('rename callback ', err); 

                insertAudioToDB(file.name, file.size, createDate(), file_id, req.user_id);
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



Create.createDate = function(){
    now = new Date(); 
    var date = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
    return date;
}

Create.db = db;
Create.table = "CREATE_posts";
Create.table.format = "(post, entry, time)";


module.exports = Create;