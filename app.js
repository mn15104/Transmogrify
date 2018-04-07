var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var url = require('url');
var WebSocketServer = require('websocket').server;
var WebSocketClient = require('websocket').client;
var WebSocketFrame  = require('websocket').frame;
var WebSocketRouter = require('websocket').router;
var W3CWebSocket = require('websocket').w3cwebsocket;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'public/views/'));
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true,
  saveUninitialized: true,
  resave: true
}));

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

var create_route = require('./routes/create.route');
var explore_route = require('./routes/explore.route');
var profile_route = require('./routes/profile.route');
var login_route = require('./routes/login.route');
app.use('/music', function(req, res, next){
  res.sendFile(path.join(__dirname + '/public/views/music.html'));
  req.session.current_url = '/music';
});
app.use('/sidepanel', function(req, res, next){
  res.sendFile(path.join(__dirname + '/public/views/sidepanel.html'));
  req.session.current_url = '/sidepanel';
});
app.use('/pulse', function(req, res, next){
  res.sendFile(path.join(__dirname + '/public/views/audio_pulse.html'));

});
app.use('/intro', function(req, res, next){
  res.sendFile(path.join(__dirname + '/public/views/intro.html'));

});
app.get('/main', function(req, res) {
  var name = 'hello';
  res.render(__dirname + "/public/views/intro.html", {name:name});
});
app.use('/profile', profile_route);
app.use('/create', create_route);
app.use('/explore', explore_route);
app.use('/login', login_route);
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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
