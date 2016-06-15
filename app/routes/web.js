
var passport = require('passport');
var express = require('express');

module.exports = (function(){

  'use strict';

  var web = express.Router();

  // middle auth
  var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/signin');
  }



  /**
   *
   */
   web.get('/signin',function(req,res){
     res.render('login.jade');
   })

  /**
   *
   */
   web.post('/signin',passport.authenticate('local',{successRedirect: '/account',failureRedirect: '/signin',failureFlash: false }),function(req,res){

   });


  /**
   *
   */
  web.get('/account',isAuthenticated,function (req,res){
    res.render('test.jade');
  })




  return web ;


})();
