var config = require('../../config/database');
var User = require('../models/users');
var passport = require('passport');
var express = require('express');
var jwt = require('jwt-simple');


module.exports = (function (){

  'use strict';

  require('../../config/passport')(passport);
  var user = express.Router();

  var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/signin');
  }

user.get('/users', function(req, res){

  User.find({},function(err,users){
    res.json(users);
  });

})

user.post('/signup', function(req, res){

  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
}) 

user.post('/authenticate', function(req, res){
  User.findOne({name: req.body.name}, function(err, user) {

    if (err) throw errr

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});

    }else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.encode(user, config.secret);  
            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        })
    }
  });
})

  user.get('/memberinfo', function(req, res) {
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
})


return user;

})();


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