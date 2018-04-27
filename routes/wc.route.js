var express = require('express');
var router = express.Router();
var path = require('path');

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 1337, clientTracking: true});

wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        console.log('received: %s', message)
    });
})

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname + '/../public/views/webcam.html'));
});



module.exports = router;