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
const enablews = require('express-ws');
var app = express();
var WebSocket = require('ws');
var WebSocketServer = require('ws').server;
var appws = require('http').createServer();
var io = require('socket.io')(appws);

app.set('views', path.join(__dirname, 'public/views/'));
app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
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
var SQL_MODEL = require('./models/sql.model'); SQL_MODEL.init();
var create_route = require('./routes/create.route');
var explore_route = require('./routes/explore.route');
var profile_route = require('./routes/profile.route');
var login_route = require('./routes/login.route');
var webcam_route = require('./routes/wc.route');
var sidepanel_route = require('./routes/sidepanel.route');
var chat_route = require('./routes/wc.route');
app.use('/flick', function(req, res, next){
  res.sendFile(path.join(__dirname + '/public/views/flick.html'));
});
app.use('/intro', function(req, res, next){
  res.sendFile(path.join(__dirname + '/public/views/intro.html'));
});
app.use('/profile', function(req, res, next){
  res.sendFile(path.join(__dirname + '/public/views/profile.html'));
});
app.use('/chat', chat_route);
app.use('/wc', webcam_route);
app.use('/sidepanel', sidepanel_route);
app.use('/myprofile', profile_route);
app.use('/create', create_route);
app.use('/explore', explore_route);
app.use('/login', login_route);

// app.use('/', function(req, res, next){
//   res.redirect('/intro');
// });
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
//app.get('/sidepanel', function(req, res, next) {
//   Sidepanel.getProfilePicture()
//   res.render(__dirname + "/public/views/sidepanel.html", {name:"name"}); 
// });
function IS_NULL(x){
  return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}
module.exports = app;
