
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
    db.get("SELECT chat_id AS chat_id FROM FRIENDSLIST WHERE (user_idA='"+user_id+"' and user_idB='" + friend_id + "') or (user_idA='"+friend_id+"' and user_idB='" + user_id + "') ", function(err, row){
        if(IS_NULL(row)){
            
            console.log("undefined" + user_id+ friend_id + chat_message);
        }else{
            chat_id = row.chat_id;
        }
    } )
    // db.get("INSERT INTO 'CHATMESSAGE' ('" + user_id + "','" + friend_id + "','" + chat_message + "')", function(err, row){

    // });
};

module.exports = Chat;