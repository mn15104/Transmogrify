
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

Chat.insertMessage = function(user_id, friend_id, chat_message){
    db.get("SELECT chat_id AS chat_id FROM FRIENDLIST WHERE (user_idA='"+user_id+"' and user_idB='" + friend_id + "') or (user_idA='"+friend_id+"' and user_idB='" + user_id + "') ", function(err, row){
        if(IS_NULL(row)){
            db.get("SELECT MAX(chat_id) AS chat_id FROM FRIENDLIST", function(err, row){
                if(IS_NULL(row.chat_id)){
                    next_chatid = 0;
                    db.get("INSERT INTO FRIENDLIST (user_idA, user_idB, chat_id) values ('" + user_id + "','" + friend_id + "','" + next_chatid  + "')", function(err, row){
                        console.log(row);
                        console.log(err);
        
                    });
                }
                else{
                    next_chatid = row.chat_id + 1;
                    db.get("INSERT INTO FRIENDLIST (user_idA, user_idB, chat_id) values ('" + user_id + "','" + friend_id + "','" + next_chatid  + "')", function(err, row){
                        console.log(row);
                        console.log(err);
        
                    });
                }
            })
        }else{
            chat_id = row.chat_id;
        }
    } )
    // db.get("INSERT INTO 'CHATMESSAGE' ('" + user_id + "','" + friend_id + "','" + chat_message + "')", function(err, row){

    // });
};

module.exports = Chat;