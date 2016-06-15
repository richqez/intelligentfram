
var passport = require('passport');

exports.home =  function (req,res){
  res.render('test.jade');
}


exports.viewLoginPage = function(req,res){

  res.render('login.jade');

}

exports.login = function(req,res){
  res.json({
    "username" : req.body.username,
    "password" : req.body.password
  });
}
