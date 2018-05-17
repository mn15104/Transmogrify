var express = require('express');
var router = express.Router();
var path = require('path');
var rooms = require("rooms");
var ws = require('../server/server')
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 1337, clientTracking: true, autoAcceptConnections: false});
var ChatModel = require('../models/chat.model');

var clients = {  };
var queue   = {  };


router.post('/connect_chat', function(req, res, next) {

});


// wss.on('request', function(request){
//     console.log("HELLO");
// });

// wss.on('connection', function (connection, req) {
   
//     wss.isAlive = true;
    
//     console.log('1. server accepted connection');

//     // ON MESSAGE
//     connection.on('message', function (msg) 
//     {
//         console.log("-> server received message: " + msg);
//         if(IsJsonString(msg))
//         {
//             var msgObj = JSON.parse(msg);
//             if(!doesClientExist(msgObj.data['user_id']))
//             {
//                 if          (msgObj.message === 'user_id')
//                 {
//                     //Accept web socket connection from user
//                     if(!IS_NULL(queue[msgObj.data['user_id']]))
//                     {
//                         newClient(msgObj.data['user_id'], connection, undefined);
//                         removeQueue(msgObj.data['user_id']);
//                         sendMessage(connection, JSON.stringify({message:'user_id_accepted'}));
//                         console.log("2. user id accepted");
//                         return;
//                     }
//                 }
//             }
//             else
//             {
//                 if          (msgObj.message === 'friend_id_req')
//                 {
//                     //Friend exists, retrieve connection and set friend info 
//                     if(!IS_NULL(clients[msgObj.data['friend_id']])){
//                         setFriend(msgObj.data['user_id'], msgObj.data['friend_id']);
//                         sendMessage(connection, JSON.stringify({message:'friend_id_accepted'}));
//                         other_con =  clients[msgObj.data['friend_id']]['user_data']['con'];
//                         sendMessage(other_con, JSON.stringify({message:'friend_id_accepted'}));
//                         console.log("3.a. friend id requested acknowledged");
//                     }
//                     //Friend hasn't connected - clients[friend_id] is undefined
//                     ///////////////////////////////////////////////////////////
//                     //  TO DO: Need to implement offline messages & use sql  //
//                     ///////////////////////////////////////////////////////////
//                     else{
//                         setFriend(msgObj.data['user_id'], msgObj.data['friend_id']);
//                         sendMessage(connection, JSON.stringify({message:'friend_req_offline'}));
//                         console.log("3.b. friend id request offline ");
//                     }
//                 }
//                 else if     (msgObj.message === "friend_message_send")
//                 {
//                     user_id     = msgObj.data['user_id'];
//                     friend_id   = clients[user_id]['user_data']['friend_id'];
//                     // Send online message
//                     if(!IS_NULL(clients[friend_id])){
//                         friend_con  = clients[friend_id]['user_data']['con'];
//                         sendMessage(friend_con, JSON.stringify({message:'friend_message_rec', 
//                             chat_message: msgObj.data['chat_message']})
//                         );
//                     }
//                     // Leave offline message
//                     else{
//                         console.log("leaving offline message");
//                         ChatModel.insertMessage(user_id, friend_id, msgObj.data['chat_message']);
//                     }
//                 }
//             }
//         }
//     });
//     wss.on('pong', function(){
//         this.isAlive = true;
//     })
//     // ON DISCONNECT
//     connection.on('close', function(connection) {
//         removeClient(connection);
//     });
//     connection.ping();
// });

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/public/views/chat.html'));
});



function sendMessage(ws, msg){
    // Wait until the state of the socket is not ready and send the message when it is...
    waitForSocketConnection(ws, function(){
        ws.send(msg);
    });
}

// Make the function wait until the connection is made...
function waitForSocketConnection(socket, callback){
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                console.log("Connection is made")
                if(callback != null){
                    callback();
                }
                return;

            } else {
                console.log("wait for connection...")
                waitForSocketConnection(socket, callback);
            }

        }, 5); // wait 5 milisecond for the connection...
}
function setFriend(user_id, friend_id){
    clients[user_id]['user_data']['friend_id'] = friend_id; //['con'];
}
function doesClientExist(user_id){
    return !IS_NULL(clients[user_id]); 
}
function newClient(user_id, con, friend_id){
    clients[user_id] = { user_data: 
                            {   con: con, 
                                friend_id: friend_id
                            }
                        };
    console.log(clients[user_id]);
}
function removeClient(conn){
    for(var client in clients){
        if(IS_NULL(client['user_data'])) {
            continue;    
        }
        else{
            if(client['user_data']['con'] == conn){
                clients[client['client_id']] = undefined;
                return;
            }
        }
    };
}
function addQueue(user_id){
    queue[user_id] = true;
}
function removeQueue(user_id){
    queue[user_id] = undefined;
}
function firstNull(){
    for (var i = 0; i < 200000; i++){
        var val = clients[parseInt(i)];
        
        if(IS_NULL(val)){
            return parseInt(i);
        }
    }
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function IS_NULL(x){
    return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}
function noop() {}
const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();
  
      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 30000);
module.exports = router;



