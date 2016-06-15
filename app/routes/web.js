
var passport = require('passport');
var express = require('express');
var User = require('../models/users')
module.exports = (function(){

  'use strict';

  var web = express.Router();



  web.get('/',function(req, res){
      res.redirect('/signin');
  });

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
     res.render('login.jade',{message : req.flash('message')});
   })

  /**
   * ตรวจสอบข้อมูลล็อคอิน
   */
   web.post('/signin',passport.authenticate('local',{ successRedirect: '/channel',failureRedirect: '/signin', failureFlash: true }));


   /**
    * แสดงหน้าสร้าง account
    */
   web.get('/register',function(req,res){
     res.render('register.jade');
   })


   /**
    * บันทึกข้อมูล
    */
   web.post('/register',function(req,res){

     var newUser = new User({
       name : req.body.username ,
       password : req.body.password ,
       email : req.body.email
     });

     newUser.save(function(err){
       if (err) {
         res.render('register.jade',{message : "Something wrong Please try "})
       }else{
        res.redirect('/signin');
       }
     });

   })


  /**
   * แสดงข้อมูลบัญชี
   */
  web.get('/',isAuthenticated,function (req,res){
    res.render('test.jade');
  })


  /**
   * แสดงข้อมูลบัญชี
   */
  web.get('/channel',isAuthenticated,function (req,res){
    var user = req.user;
    //console.log(user);
    res.render('channel.jade');

  })







  return web ;


})();
