
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

Chat.insertMessage = function(user_id, friend_id, chat_message){
    Chat.loadMessages(0);
    date = createDate();
    db.get("SELECT chat_id AS chat_id FROM FRIENDLIST WHERE (user_idA='"+user_id+"' and user_idB='" + friend_id + "') or (user_idA='"+friend_id+"' and user_idB='" + user_id + "') ", function(err, row){
        if(IS_NULL(row)){
            insertChatID(user_id, friend_id, Chat.safeInsertMessage)
        }else{
            chat_id = row.chat_id;
            Chat.safeInsertMessage(chat_id, date, user_id, friend_id, chat_message);
        }
    } )
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
            console.log("here");
            callback([]);
        }else{
            chat_id = row.chat_id;
            db.all("SELECT * FROM CHATMESSAGE WHERE chat_id='" + chat_id + "' ORDER BY session_id LIMIT 20", function(err, row){
                if (err) console.log(err);
                console.log("here2");
                console.log(callback);
                if (typeof callback == 'function'){
                    console.log("here3");
                    console.log(row);
                    callback(row);
                }
                else{
                    console.log("here4");
                    return row;
                }
            });
        }
    } )
}

Chat.createDate = function(){
    now = new Date(); 
    var date = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss");
    return date;
}

module.exports = Chat;