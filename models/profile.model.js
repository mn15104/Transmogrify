var util = require('util');
var config = require('../config');
var sqlite3 = require('sqlite3');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var dateFormat = require('dateformat');
var ejs = require('ejs');
var ChatModel = require('./chat.model');
var ExploreModel = require('./explore.model');
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

Profile.loadProfileFile = function(req, res){
    ExploreModel.loadProfileFile(req, res);
};
Profile.loadOtherProfile = function(req, res, load){
    var other_user_id = req.query.user_id;
    console.log(other_user_id);
    db.get("SELECT * FROM 'USER_PROFILE' WHERE user_id='"+  other_user_id  + "'", function(err, row){
        if (err) throw err;
        if (!IS_NULL(row)){
            var occupation = row.occupation;
            var description = row.description;
            var friend_profile_picture = row.profile_picture;

            db.get("SELECT firstname, surname FROM USER_LOGIN WHERE user_id='"+  other_user_id  + "'", function(err, row){
                if (err) throw err;
                if (!IS_NULL(row)){

                    var firstname = row.firstname;
                    var surname = row.surname;
                    db.get("SELECT profile_picture AS 'profile_picture' FROM 'USER_PROFILE' WHERE user_id='"+  req.session.user_id  + "'", function(err, row){
                        if(err) console.log(err);
                        var our_profile_picture = row.profile_picture;
                        var render_profile = function(chat_messages){
                            res.render('profile.ejs', 
                            {   'firstname': firstname,
                                'surname': surname,
                                'user_id': other_user_id,
                                'occupation':occupation,
                                'description':description,
                                'our_profile_picture':our_profile_picture,
                                'friend_profile_picture':friend_profile_picture,
                                'chat_messages': chat_messages,
                            });
                        }
                        ChatModel.loadMessages(req.session.user_id, other_user_id, render_profile);

                        if(!load){
                            loadDefaultProfile(res);
                        }
                    });
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
                            'profile_picture':'profile_picture',
                            'friend_profile_picture':'friend_profile_picture'
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
    form.uploadDir = path.join(__dirname, '../public/images/profile_pictures');
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(500).json({ error: err })
        
    });
    form.on('fileBegin', function (name, file) {
        const [fileName, fileExt] = file.name.split('.');
        console.log(fileName);
        file.path = path.join( path.join(__dirname, '../public/images/profile_pictures')
                                , `${fileName}_${new Date().getTime()}.${fileExt}`);
        relative_file_path = '../images/profile_pictures/' + `${fileName}_${new Date().getTime()}.${fileExt}`;
        console.log(relative_file_path);
        db.get("UPDATE USER_PROFILE SET profile_picture = '" + relative_file_path 
                + "' WHERE user_id='" + req.session.user_id + "'", function(row,err) {
                    if(err) console.log(err); 
                    else {console.log(relative_file_path + "  " +req.session.user_id);res.status(200).json({ uploaded: true })}
        });
    });

}

module.exports = Profile;