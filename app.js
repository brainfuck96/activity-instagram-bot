const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const _ = require('lodash');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// const session = require('express-session');
// const MySQLStore = require('express-mysql-session')(session);

var app = express();	


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST_NAME,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});

// const sessionStore = new MySQLStore({
//   schema: {
//     tableName: 'sessions'

//   }
// }, connection);


// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: sessionStore
// }))


app.locals = {
    domain:`http://${process.env.IP}:${process.env.PORT}`
};

// bot section

const bot = require("./bot_setup")(app);


app.use(express.static(path.join(__dirname, 'public')));


const routes = require('./routes');

_.each(routes, (ctrl, route) => app.use(route, ctrl(app, route)));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = {
    App: app,
    Connection: connection
};