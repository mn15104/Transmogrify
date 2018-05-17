var express = require('express');
var session = require('express-session');
var redis   = require("redis");
var redisStore = require('connect-redis')(session);
var client  = redis.createClient();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var url = require('url');
var app = express();
var WebSocket = require('ws');
var WebSocketServer = require('ws').server;
var appws = require('http').createServer();
var io = require('socket.io')(appws);
var expressWs = require('express-ws')(app);
var serverjs = require('./server/server');
var SQL_MODEL = require('./models/sql.model'); SQL_MODEL.init();
var create_route = require('./routes/create.route');
var explore_route = require('./routes/explore.route');
var myprofile_route = require('./routes/myprofile.route');
var profile_route = require('./routes/profile.route');
var login_route = require('./routes/login.route');
var sidepanel_route = require('./routes/sidepanel.route');
var chat_route = require('./routes/chat_ws.route');
var webcam_route = require('./routes/vid_ws.route');
var debug = require('debug')('testapp:server');
var http = require('http');
var port = normalizePort(process.env.PORT || '3000');

app.set('views', path.join(__dirname, 'public/views/'));
app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);
app.use(session({
  store: new redisStore({host:'localhost', port: 6379, client: client, ttl:260}),
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true,
  saveUninitialized: false,
  resave: false
}));

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
  console.log( url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  }));
  next();
});

// ---------------------------------------------------------------//

app.set('port', port);

var server = http.createServer(app);


server.on('error', onError);
server.on('listening', onListening);
server.on('data', function (chunk) {
  if(!(chunk == undefined)) data += chunk;
});
server.on('end', function () {
    data
    }, function(err) {
        reject(err);
    });

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

var clients = {  };
var queue   = {  };
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
app.ws('/', function(ws, req) {
  ws_user_id = req.session.user_id;
  newClient(ws_user_id, ws, undefined);
  ws.on('message', function (msg) 
  {
      console.log(req.session.user_id);
      console.log("-> server received message: " + msg);
      
      if(IsJsonString(msg))
      {
          var msgObj = JSON.parse(msg);
       
              if          (msgObj.message === 'friend_id_req')
              {
                  //Friend exists, retrieve connection and set friend info 
                  if(!IS_NULL(clients[msgObj.data['friend_id']])){
                    console.log(req.session.user_id);
                      setFriend(req.session.user_id, msgObj.data['friend_id']);
                      sendMessage(ws, JSON.stringify({message:'friend_id_accepted'}));
                      other_con =  clients[msgObj.data['friend_id']]['user_data']['con'];
                      sendMessage(other_con, JSON.stringify({message:'friend_id_accepted'}));
                      console.log("3.a. friend id requested acknowledged");
                  }
                  //Friend hasn't connected - clients[friend_id] is undefined
                  ///////////////////////////////////////////////////////////
                  //  TO DO: Need to implement offline messages & use sql  //
                  ///////////////////////////////////////////////////////////
                  else{
                    console.log(req.session.user_id);
                      setFriend(req.session.user_id, msgObj.data['friend_id']);
                      sendMessage(ws, JSON.stringify({message:'friend_req_offline'}));
                      console.log("3.b. friend id request offline ");
                  }
              }
              else if     (msgObj.message === "friend_message_send")
              {
                  friend_id   = clients[req.session.user_id]['user_data']['friend_id'];
                  // Send online message
                  if(!IS_NULL(clients[friend_id])){
                      friend_con  = clients[friend_id]['user_data']['con'];
                      sendMessage(friend_con, JSON.stringify({message:'friend_message_rec', 
                          chat_message: msgObj.data['chat_message']})
                      );
                  }
                  // Leave offline message
                  else{
                      console.log("leaving offline message");
                      ChatModel.insertMessage(req.session.user_id, friend_id, msgObj.data['chat_message']);
                  }
              }
          
      }
  });

  // ON DISCONNECT
  ws.on('close', function(connection) {
      removeClient(connection);
  });

});


app.use('/ej', function(req, res, next){
  res.render('myprofile', { profile_image: '../images/profile_pictures/doggo_1526416712522.png',
                            firstname:'',
                            description: '',
                            email:'',
                                  });
});
app.use('/intro', function(req, res, next){
  res.sendFile(path.join(__dirname + '/public/views/intro.html'));
});
app.use('/webcam', webcam_route);
// app.use('/chat', chat_route);
app.use('/sidepanel', sidepanel_route);
app.use('/profile', profile_route);
app.use('/myprofile', myprofile_route);
app.use('/create', create_route);
app.use('/explore', explore_route);
app.use('/login', login_route);
app.post('/whatsmyid', function(req,res,next){
    res.status(200).send({'user_id':req.session.user_id});
});
app.use('/', function(req, res, next){
    res.redirect('/sidepanel');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.redirect('/sidepanel');
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




function IS_NULL(x){
  return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}

app.listen(3000);
module.exports = app;
