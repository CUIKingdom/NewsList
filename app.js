var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var credentials = require('./bin/credentials');
var session = require('express-session');


var routes = require('./routes/index');
var getNews = require("./routes/getNews");
var getComments = require("./routes/getComments");
var admin = require("./routes/admin");

var hbs = require("express3-handlebars");
var hbs = hbs.create({
  defaultLayout:'main',
  helpers: {
    section: function(name, options){
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  },
  extname: "hbs"
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(credentials.cookieSecrect));
app.use(session({
  //secret: credentials.cookieSecrect,
  //resave: false,
  //saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  if(req.cookies.islogin){
    req.session.islogin = req.cookies.islogin;
  }
  if(req.session.islogin){
    res.locals.islogin = req.session.islogin;
  }
  if(req.session.role) {
    res.locals.role = req.session.role;
  }
  next();
});
app.use('/', routes);
app.use('/', getNews);
app.use('/', getComments);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
