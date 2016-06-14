var express = require('express');
var app =	express();
var bodyParser  = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var User = require('./app/models/users')
var port = process.env.PORT || 8080;
var jwt = require('jwt-simple');
var userR = require('./app/routes/users');


mongoose.connect(config.database);
 
// pass passport for configuration
require('./config/passport')(passport);
 
// bundle our routes
var apiRoutes = express.Router();



//get our require parameters
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(passport.initialize());

app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

apiRoutes.post('/signup',passport.authenticate('jwt', { session: false}),userR.signup);

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
