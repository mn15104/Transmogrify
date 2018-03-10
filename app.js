var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var url = require('url');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true,
  resave: true,
  saveUninitialized: true
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
//Set up routers
var index_route = require('./routes/index.route');
var home_route = require('./routes/home.route');
var explore_route = require('./routes/explore.route');
app.use('/profile', function(req, res, next){
  res.sendFile(path.join(__dirname + '/public/views/profile.html'));
  req.session.current_url = '/profile';
});
app.use('/home', home_route, function(){
  req.session.current_url = '/home';
});
app.use('/explore', explore_route, function(){
  req.session.current_url = '/explore';
});
app.use('/sidepanel', function(req, res, next){
  res.sendFile(path.join(__dirname + '/public/views/sidepanel.html'));
  req.session.current_url = '/sidepanel';
});
app.use('/login', function(req, res, next){
  res.sendFile(path.join(__dirname + '/public/views/login.html'));
  req.session.current_url = '/login';
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
