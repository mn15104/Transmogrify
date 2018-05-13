var express = require('express');
var router = express.Router();
var path = require('path');
var rooms = require("rooms");
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 1338, clientTracking: true, autoAcceptConnections: false});

var clients = {  };
var queue   = {  };



router.post('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/public/views/webcam.html'));
});


wss.on('request', function(request){
    console.log("HELLO");
});

wss.on('connection', function (connection, req) {
   
    wss.isAlive = true;
    
    console.log('1. server accepted connection');

    // ON MESSAGE
    connection.on('message', function (msg) 
    {
        console.log("-> server received message: " + msg);
        if(IsJsonString(msg))
        {
            var msgObj = JSON.parse(msg);
          
            
        }
    });
    wss.on('pong', function(){
        this.isAlive = true;
    })
    // ON DISCONNECT
    connection.on('close', function(connection) {
        removeClient(connection);
    });
    connection.ping();
});

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



