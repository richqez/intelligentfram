var express = require('express');
var path = require('path');
var app =	express();
var bodyParser  = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var User = require('./app/models/users')
var port = process.env.PORT || 9000;
var jwt = require('jwt-simple');
var session = require('express-session')
var cookieParser = require('cookie-parser')


var LocalStrategy = require('passport-local').Strategy;


var userR = require('./app/routes/users');
var webR = require('./app/routes/web');


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


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({name: username}, function(err, user) {

      if (err) throw errr

      if (!user) {
        return done(null, false, { message: 'Authentication failed. User not found..' });
      }else {
        // check if password matches
        user.comparePassword(password, function (err, isMatch) {
  	        if (isMatch && !err) {
              console.log(user);
  	          return done(null, user);
  	        } else {
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

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();


  console.log(req.user);
  res.redirect('/login');
}

/**
 *  Web app ROUTE
 */
app.get('/account',isAuthenticated,webR.home);
app.get('/login',webR.viewLoginPage);
app.post('/login',passport.authenticate('local',{
                                    successRedirect: '/account',
                                    failureRedirect: '/login',
                                    failureFlash: false }),webR.login);



/**
 *  API ROUTE
 */
apiRoutes.post('/signup',userR.signup);
apiRoutes.get('/users',userR.users);
apiRoutes.post('/authenticate',userR.authenticate);
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json(user);
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};


// connect the api routes under /api/*
app.use('/api', apiRoutes);



















app.listen(port);
console.log('There will be localhost'+port);
