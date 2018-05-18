var util = require('util');
var config = require('../config');
var sqlite3 = require('sqlite3');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var dateFormat = require('dateformat');
var ejs = require('ejs');

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

Profile.loadMyProfile = function(req, res, load){
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
                    if(load){
                        res.render('myprofile.ejs', 
                        
                        {   'firstname': firstname,
                            'surname': surname,
                            'email': email,
                            'occupation':occupation,
                            'description':description,
                            'profile_picture':profile_picture
                        });
                    }
                    else{
                        var stringprofdata = JSON.stringify(profdata);
                        console.log(stringprofdata);
                        res.send(stringprofdata);
                    }
                }else res.sendStatus(400);
            });
        }else res.sendStatus(400);
    });
};
Profile.loadOtherProfile = function(req, res, load){
    var other_user_id = req.query.user_id;
    console.log(other_user_id);
    db.get("SELECT * FROM 'USER_PROFILE' WHERE user_id='"+  other_user_id  + "'", function(err, row){
        if (err) throw err;
        if (!IS_NULL(row)){
            var occupation = row.occupation;
            var description = row.description;
            var profile_picture = row.profile_picture;
            db.get("SELECT firstname, surname FROM USER_LOGIN WHERE user_id='"+  other_user_id  + "'", function(err, row){
                if (err) throw err;
                if (!IS_NULL(row)){
                    console.log(row);
                    var firstname = row.firstname;
                    var surname = row.surname;

                    var profdata = {                        
                        firstname: firstname,
                        surname: surname,
                        occupation:occupation,
                        description:description,
                        profile_picture:profile_picture
                    }
                    if(load){
                        res.render('profile.ejs', 
                        {   'firstname': firstname,
                            'surname': surname,
                            'user_id': other_user_id,
                            'occupation':occupation,
                            'description':description,
                            'profile_picture':profile_picture
                        });
                    }
                    else{
                        loadDefaultProfile(res);
                    }
                }else  loadDefaultProfile(res);
            });
        }else  loadDefaultProfile(res);
    });


    var loadDefaultProfile = function(res){
        res.render('profile.ejs', 
                        {   'firstname': 'firstname',
                            'surname': 'surname',
                            'user_id': '-1',
                            'occupation':'occupation',
                            'description':'description',
                            'profile_picture':'profile_picture'
                        });
    }
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
    });
    form.on('fileBegin', function (name, file) {
        const [fileName, fileExt] = file.name.split('.');
        
        file.path = path.join( path.join(__dirname, '../uploads/profile_pictures')
                                , `${fileName}_${new Date().getTime()}.${fileExt}`);
        relative_file_path = '/../../uploads/profile_pictures/' + `${fileName}_${new Date().getTime()}.${fileExt}`;
        db.all("UPDATE USER_PROFILE SET profile_picture = '" + relative_file_path 
                + "' WHERE user_id='" + req.session.user_id + "'", function(row,err) {
        });
    });

}

module.exports = Profile;