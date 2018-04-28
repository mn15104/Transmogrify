//https://gist.github.com/martinsik/2031681
var express = require('express');
var router = express.Router();
var path = require('path');
var rooms = require("rooms");
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 1337, clientTracking: true, autoAcceptConnections: false});

var clients = {  };
var queue   = {  };

router.post('/connect_chat', function(req, res, next) {
    queue[req.body.user_id] = true;
    console.log("queue at " + req.session.user_id + " set to " +    queue[req.session.user_id]);
    res.status(200).send({ message: "Websocket id acknowledged"});
});


wss.on('request', function(request){
    console.log("HELLO");
});

wss.on('connection', function (connection, req) {

    var name = req.connection.remoteAddress + ":" + req.connection.remotePort;
    var user_id;
    var other_user_id;

   
    console.log('1. server accepted connection');

    // ON MESSAGE
    connection.on('message', function (msg) 
    {
        console.log("-> server received message: " + msg);
        if(IsJsonString(msg))
        {
            var msgObj = JSON.parse(msg);
            if(IS_NULL(user_id))
            {
                if          (msgObj.message === 'user_id')
                {
                    console.log(queue[msgObj.user_id]);
                    if(!IS_NULL(queue[msgObj.user_id]))
                    {
                        user_id = msgObj.user_id;
                        clients[user_id] = connection;
                        connection.send('2. user id accepted');
                        console.log("2. user id accepted");
                        return;
                    }
                }
            }
            else
            {
                if          (msgObj.message === 'other_user_id')
                {
                    other_user_id = msgObj.other_user_id;
                    console.log("3. other user id requested acknowledged: " + other_user_id);
                }
                else if     (msgObj.message === "chat_message")
                {
                    other_con = clients[other_user_id];
                    other_con.send(msgObj.chat_message);
                    connection.send("message sent to: " + other_user_id);
                    console.log("4. message sent to: " + other_user_id);
                }
            }
        }
    });

    // ON DISCONNECT
    connection.on('close', function(connection) {
        if(!IS_NULL(user_id)) clients[user_id] = undefined;
    });
});

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/public/views/chat.html'));
});

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
module.exports = router;



