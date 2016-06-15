var express = require('express');
var path = require('path');
var app =	express();
var bodyParser  = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var User = require('./app/models/users');
var port = process.env.PORT || 9898;
var jwt = require('jwt-simple');
var session = require('express-session')
var cookieParser = require('cookie-parser')
var flash = require('connect-flash');


var LocalStrategy = require('passport-local').Strategy;


var userR = require('./app/routes/users');
var webRoute = require('./app/routes/web');


require('./config/passport')(passport);

var apiRoutes = express.Router();

mongoose.connect(config.database);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('trust proxy', 1)
app.use(cookieParser())
app.use(session({
  secret: 'xzcxsad',
  resave: false,
  saveUninitialized: true,
}))


app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/')));


app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  {passReqToCallback: true},
  function(req,username, password, done) {
    User.findOne({name: username}, function(err, user) {

      if (err) throw errr

      if (!user) {
          req.flash("Authentication failed. User not found..")
        return done(null, false, { message: 'Authentication failed. User not found..' });
      }else {
        // check if password matches
        user.comparePassword(password, function (err, isMatch) {
  	        if (isMatch && !err) {
              console.log(user);
  	          return done(null, user);
  	        } else {
              req.flash("message","Incorrect password")
  	          return done(null, false, { message: 'Incorrect password.' });
  	        }
  	      })
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/**
 *  Web app ROUTE
 */

 app.use('/',webRoute);
 app.use('/api',userR);

/**
 *  API ROUTE
 */
// apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}),

// connect the api routes under /api/*



















app.listen(port);
console.log('There will be localhost'+port);
