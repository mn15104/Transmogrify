
var http = require('http');
var sqlite3 = require('sqlite3');
var Chat = function (){

}

function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}
// **************************************************************************************************** //
let db = new sqlite3.Database('./Dev.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the Login db.');
});
// **************************************************************************************************** //

Chat.safeInsertMessage = function(chat_id, date, user_id, friend_id, chat_message){
    db.get("SELECT MAX(session_id) AS session_id FROM CHATMESSAGE", function(err, row){
        if(IS_NULL(row)){
            session_id = 0;
            db.get("INSERT INTO CHATMESSAGE (chat_id, user_send, user_receive, message, time, session_id) values ('" + chat_id + "','" + user_id + "','" + friend_id + "','" + chat_message +  "','" + date +"','" + session_id + "')", function(err, row){
                if(err) console.log(err);
            })
        }else{
            session_id = row.session_id + 1;
            db.get("INSERT INTO CHATMESSAGE (chat_id, user_send, user_receive, message, time, session_id) values ('" + chat_id + "','" + user_id + "','" + friend_id + "','" + chat_message +  "','" + date + "','"+session_id+"')", function(err, row){
                if(err) console.log(err);
            })
        }
    } )
};

Chat.insertMessage = function(user_id, friend_id, chat_message, callback){
    date = createDate();
    db.get("SELECT chat_id AS chat_id FROM FRIENDLIST WHERE (user_idA='"+user_id+"' and user_idB='" + friend_id + "') or (user_idA='"+friend_id+"' and user_idB='" + user_id + "') ", function(err, row){
        if(IS_NULL(row)){
            insertChatID(user_id, friend_id, Chat.safeInsertMessage)
        }else{
            chat_id = row.chat_id;
            Chat.safeInsertMessage(chat_id, date, user_id, friend_id, chat_message);
        }
    } )
    db.get("SELECT profile_picture AS profile_picture FROM USER_PROFILE WHERE user_id='"+user_id+"'",function(err, row){
        if(err)console.log(err)
        profile_picture = row.profile_picture;
        if(callback && typeof(callback) === "function"){
            callback(profile_picture);
        }
    })
};

Chat.insertChatID = function(user_id, friend_id, callback){
    date = createDate();
    db.get("SELECT MAX(chat_id) AS chat_id FROM FRIENDLIST", function(err, row){
        if(IS_NULL(row.chat_id)){
            next_chatid = 0;
            db.get("INSERT INTO FRIENDLIST (user_idA, user_idB, chat_id) values ('" + user_id + "','" + friend_id + "','" + next_chatid + "')", function(err, row){
                if(err) throw err;
                if(callback) callback(next_chatid, date, user_id, friend_id, chat_message);
            });
        }
        else{
            next_chatid = row.chat_id + 1;
            db.get("INSERT INTO FRIENDLIST (user_idA, user_idB, chat_id) values ('" + user_id + "','" + friend_id + "','" + next_chatid  + "')", function(err, row){
                if(err) throw err;
                if(callback) callback(next_chatid, date, user_id, friend_id, chat_message);
            });
        }
    })
}

Chat.loadMessages = function(user_id, friend_id, callback){
    db.get("SELECT chat_id AS chat_id FROM FRIENDLIST WHERE (user_idA='"+user_id+"' and user_idB='" + friend_id + "') or (user_idA='"+friend_id+"' and user_idB='" + user_id + "') ", function(err, row){
        if (err) console.log(err);
        if(IS_NULL(row)){
            callback([]);
        }else{
            chat_id = row.chat_id;
            db.all("SELECT * FROM CHATMESSAGE WHERE chat_id='" + chat_id + "' ORDER BY session_id LIMIT 20", function(err, row){
                if (err) console.log(err);
                if (typeof callback == 'function'){
                    row.forEach(msg => {var t = Chat.parseDate(msg.time);
                                        msg_p = msg;
                                        msg_p.time = t;
                                        return msg_p;})
                    callback(row);
                }
                else{
                    return row;
                }
            });
        }
    } )
}

Chat.parseDate = function(isostring){
    x = isostring;

    MM = {Jan:"January", Feb:"February", Mar:"March", Apr:"April", May:"May", Jun:"June", Jul:"July", Aug:"August", Sep:"September", Oct:"October", Nov:"November", Dec:"December"}

    xx = String(new Date(x)).replace(
        /\w{3} (\w{3}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):[^(]+\(([A-Z]{3})\)/,
        function($0,$1,$2,$3,$4,$5,$6){
            return MM[$1]+" "+$2+", "+$3+" - "+$4%12+":"+$5+(+$4>12?"PM":"AM")+" "+$6 
        }
    )
    return xx;
}

Chat.createDate = function(){
    now = new Date(); 
    var date = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
    return date;
}

module.exports = Chat;