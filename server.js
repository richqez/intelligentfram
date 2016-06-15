var express = require('express');
var path = require('path');
var app =	express();
var bodyParser  = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var User = require('./app/models/users')
var port = process.env.PORT || 8081;
var jwt = require('jwt-simple');
var userR = require('./app/routes/users');

require('./config/passport')(passport);

var apiRoutes = express.Router();

mongoose.connect(config.database);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/')));

app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(passport.initialize());

app.get('/', function(req, res) {
  res.render('test.jade');
});


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
