var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./models/db'); // Ensure the database connection is established
const session = require('express-session');


var indexRouter = require('./routes/index');
// Dynamically import all route files
const fs = require('fs');
const routesPath = path.join(__dirname, 'routes');
const routeFiles = fs.readdirSync(routesPath).filter(file => file.endsWith('.js'));

// Create a map to store all routes
const routes = {};
routeFiles.forEach(file => {
  const routeName = file.replace('.js', '');
  routes[routeName] = require(`./routes/${file}`);
});

// indexRouter is still explicitly referenced for legacy compatibility
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Add session middleware
app.use(session({
  secret: 'matuka_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true if using HTTPS
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use index route at root path
app.use('/', indexRouter);

// Dynamically use all other routes
Object.keys(routes).forEach(routeName => {
  if (routeName !== 'index') {
    app.use(`/${routeName}`, routes[routeName]);
  }
});

// Expose req.session as 'session' to all EJS views
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

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

module.exports = app;
