//https://gist.github.com/martinsik/2031681
var express = require('express');
var router = express.Router();
var path = require('path');
var rooms = require("rooms");
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 1337, clientTracking: true, autoAcceptConnections: false});

var clients = {  };
wss.on('request', function(request){
    console.log("HELLO");
})
wss.on('connection', function (connection, req) {
    if(IS_NULL(req.session)){
        connection.send('user id not found, please log in first');
        connection.close();
        return;
    }

    console.log(req.session);
    
    var name = req.connection.remoteAddress + ":" + req.connection.remotePort;
    var user_id = req.session.user_id;
    var other_user_id;

    clients[index] = connection;
    console.log('1. server accepted connection: ' + user_id);

    // ON MESSAGE
    connection.on('message', function (message) 
    {
        console.log("2. server received message: " + message);
        if(IsJsonString(message))
        {
            var messageObj = JSON.parse(message);
            if     (messageObj.type === 'other_user_id'){
                other_user_id = messageObj.other_user_id;
                console.log("3. other user id requested acknowledged: " + other_user_id);
            }
            else if(messageObj.type === "chat_message"){
                other_con = clients[other_user_id];
                other_con.send(messageObj.chat_message);
                connection.send("message sent to: " + other_user_id);
                console.log("4. message sent to: " + other_user_id);
            }
        }
    });

    // ON DISCONNECT
    connection.on('close', function(connection) {
        clients[index] = undefined;
    });
});

router.get('/connect_chat', function(req, res, next) {
    req.session.ws_partner_id = 0;
});

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/../public/views/webcam.html'));
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



