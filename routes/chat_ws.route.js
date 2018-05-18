var express = require('express');
var router = express.Router();
var path = require('path');
var rooms = require("rooms");
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 1337, clientTracking: true, autoAcceptConnections: false});
var ChatModel = require('../models/chat.model');

var clients = {  };
var queue   = {  };


router.post('/connect_chat', function(req, res, next) {

});

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



