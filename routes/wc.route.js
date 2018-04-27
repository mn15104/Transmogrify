//https://gist.github.com/martinsik/2031681
var express = require('express');
var router = express.Router();
var path = require('path');
var rooms = require("rooms");
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 1337, clientTracking: true, autoAcceptConnections: false});

var clients = [ ];
wss.on('request', function(request){
    console.log("HELLO");
})
wss.on('connection', function (connection, req) {
    var index;
    var name;

    console.log('1. server accepted connection');
    
    connection.on('message', function (message) {
        console.log("2. server received message: " + message);

        if(IsJsonString(message)){
            var messageObj = JSON.parse(message);

            if    (messageObj.message === 'userid_init'){
                name  = req.connection.remoteAddress + ":" + req.connection.remotePort;
                index = clients.push(connection) - 1;
                connection.send("data accepted");
                console.log('3. server accepted init data');
            }
            else if(messageObj.message === "chat_message"){

            }

        }
    });

    connection.on('close', function(connection) {
        console.log(index);
        console.log(name);
        clients[index] = null;
        // if (userName !== false && userColor !== false) {
        //     console.log((new Date()) + " Peer "
        //         + connection.remoteAddress + " disconnected.");
        //     // remove user from the list of connected clients
        //     clients.splice(index, 1);
        //     // push back user's color to be reused by another user
        //     colors.push(userColor);
        // }
    });
});

router.get('/connect_chat', function(req, res, next) {
    req.session.ws_partner_id = 0;
});

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/../public/views/webcam.html'));
});


function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function firstNull(){
    for (var i = 0; i < 200000; i++){
        
    }
}

module.exports = router;



