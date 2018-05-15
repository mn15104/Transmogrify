var util = require('util');
var config = require('../config');
var sqlite3 = require('sqlite3');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var dateFormat = require('dateformat');
 

var Profile = function (){

}

function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}

// **************************************************************************************************** //
let db = new sqlite3.Database('./Dev.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to Profile DB.');
});

// **************************************************************************************************** //

Profile.loadMyProfile = function(req, res){
    var user_id = req.session.user_id;
    db.get("SELECT * FROM 'USER_PROFILE' WHERE user_id='"+  user_id  + "'", function(err, row){
        if (err) throw err;
        if (!IS_NULL(row)){
            var occupation = row.occupation;
            var description = row.description;
            var profile_picture = row.profile_picture;
            db.get("SELECT firstname, surname, email FROM USER_LOGIN WHERE user_id='"+  user_id  + "'", function(err, row){
                if (err) throw err;
                if (!IS_NULL(row)){
                    console.log(row);
                    var firstname = row.firstname;
                    var surname = row.surname;
                    var email = row.email;

                    var profdata = {                        
                        firstname: firstname,
                        surname: surname,
                        email: email,
                        occupation:occupation,
                        description:description,
                        profile_picture:profile_picture
                    }
                    var stringprofdata = JSON.stringify(profdata);
                    console.log(stringprofdata);
                    res.send(stringprofdata);
                }else res.sendStatus(400);
            });
        }else res.sendStatus(400);
    });
};

Profile.loadChatHistory = function(req, res){
    var other_user_id = req.body.user_id;
    var user_id = req.session.user_id;
    var messages = [];
    var counter = 0;
    db.all("SELECT * FROM USER_CHATHISTORY WHERE user_idA='"+  user_id  + "' OR '" + other_user_id
            + " AND user_idB = '" + user_id + "' OR '" + otheruser_id + "' ORDER BY id DESC LIMIT 20", (err, rows) => {
                if (err) throw err;
                counter = rows.length;
                rows.forEach((row) => {
                    if(!IS_NULL(row)){
                        var str_row = JSON.stringify(row);
                        messages.push(str_row);
                        counter  = counter - 1;
                    }
                    if(counter === 0) {
                        var str_messages = JSON.stringify(messages);
                        res.send(str_messages);
                    }
                })
            });
    
}

Profile.uploadProfilePicture = function(req, res){
    var form = new formidable.IncomingForm()
    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = path.join(__dirname, '../uploads/profile_pictures');
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(500).json({ error: err })
        res.status(200).json({ uploaded: true })
    })
    form.on('fileBegin', function (name, file) {
        const [fileName, fileExt] = file.name.split('.')
        file.path = path.join( path.join(__dirname, '../uploads/profile_pictures')
                                , `${fileName}_${new Date().getTime()}.${fileExt}`)
    })

    // form.multiples = false;
  
    // if (!fs.existsSync(path.join(__dirname, '../uploads/profile_pictures'))){
    //   fs.mkdirSync(path.join(__dirname, '../uploads/profile_pictures'));
    // }
    // form.uploadDir = path.join(__dirname, '../uploads/profile_pictures');
  
    // form.on('file', function(field, file) {
    // //   db.get("SELECT MAX(file_id) as max_id FROM AUDIO_UPLOADS", function(err, row){
    //     //   if (err) throw err;
    //     //   console.log(row);
    //     //   var file_id = IS_NULL(row.max_id) ? 0 : row.max_id + 1;
    //     //   var file_id_str = file_id.toString();
  

    //         fs.rename(file.path, path.join(form.uploadDir, "file_id_str", file.name), function (err) {
    //             if(err) console.log('rename callback ', err); 

    //         //   insertAudioToDB(file.name, file.size, createDate(), file_id, req.user_id);
    //         });
      
    // //   });
    // });
  
    // // log any errors that occur
    // form.on('error', function(err) {
    //   console.log('An error has occurred: \n' + err);
    // });
  
    // // once all the files have been uploaded, send a response to the client
    // form.on('end', function() {
    //   res.end('success');
    // });
  
    // form.parse(req);
}

module.exports = Profile;