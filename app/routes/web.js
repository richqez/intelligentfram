
var passport = require('passport');
var express = require('express');

module.exports = (function(){

  'use strict';

  var web = express.Router();

  /**
   * ตรวจสอบกาล็อคอิน
   */
  var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/signin');
  }



  /**
   *  แสดง หน้า login
   */
   web.get('/signin',function(req,res){
     res.render('login.jade');
   })

  /**
   * ตรวจสอบข้อมูลล็อคอิน
   */
   web.post('/signin',passport.authenticate('local',{successRedirect: '/account',failureRedirect: '/signin',failureFlash: false }),function(req,res){

   });


  /**
   * แสดงข้อมูลบัญชี
   */
  web.get('/account',isAuthenticated,function (req,res){
    res.render('test.jade');
  })




  return web ;


})();
