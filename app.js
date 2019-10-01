const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config.json');
const mongoose = require('mongoose');
mongoose.connect(config.database);

const models = require('./models');

const userRoutes = require('./routes/user/');
const testRoutes = require('./routes/test');
const resultRoutes = require('./routes/result/');
const questionRoutes = require('./routes/question');
const oneTimeTestsRoutes = require('./routes/one-time-test');
const tagRoutes = require('./routes/tag')

var app = express();

app.use(function(req, res, next) {
  var allowedOrigins = ['http://localhost:4200', 'http://trembit.com'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users/', userRoutes);
app.use('/tests/', testRoutes);
app.use('/results/', resultRoutes);
app.use('/questions/', questionRoutes);
app.use('/oneTimeTests', oneTimeTestsRoutes);
app.use('/tags', tagRoutes);

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

  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;
