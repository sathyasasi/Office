var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var restify = require('restify');
var bunyan = require('bunyan');
var Response = require('../helpers/response.js');
var error = require('../helpers/errors.js');
var common = require('../helpers/common.js');
var mail = require('../helpers/mail.js');
var User = require('../models/user.js');
var express = require('express');
var app = express();

exports.signexample = function(req, res, next){
 // var a = new array();
  User.findAll({}), function validate(user){

      for(var i=0; i<user.length; i++){
          if(a[i] == user)
              console.log(user);
          else{
              console.log("not user");
          }
      }
  }



}


    /* var userarray = ["phone","email"];
     for(i=0;i<)
     exports.validate = function(req, res, next){

     }
     var a = new Array();
     var a = [];

     var validate = function(user){
     console.log('user', user);
     };
     var  usingNow = function(callback){
     callback('getit');
     };*/


exports.signupuser = function(req, res, next){
  var registeringUser = req.body.user;
    var phone = req.body.user.phone;


 if(typeof registeringUser.phone == 'undefined' || registeringUser.phone == ''){
  res.send(400,{user:'phone is missing'});
  return next();
} else {
  var phone = registeringUser.phone;
  if(phone.substr(0, 3) != '+91' && phone.split(phone.substr(0, 3))[1].length != 10) {
    res.send(400,{user:'Phone number should belong to India.'});
    return next();
  }
}

if(typeof registeringUser.email == 'undefined' || registeringUser.email == ''){
    res.send(400,{user:'email is missing'});
    return next();
  }
  User.findOne({'phone': registeringUser.phone}, function(err, user){
    if(err){
    res.send(400,{user:'error lookingup phone'});
    return next();
  }
    if(user){
      res.send(400,{user:'phone already exists'});
      return next();
    } else if(!user){
      User.findOne({'email': registeringUser.email}, function(err, user){
        if(err){
        res.send(400,{user:'error lookingup email'});
        return next(); }
        if(user){
          res.send(400,{user:'email already exists'});
          return next();
        } else if(!user){
          registeringUser.status = 'Active';
          User.create(registeringUser, function(err, loggedInUser){
            if(err) error.processError(err, req, res);
            if(!loggedInUser){
              res.send(400,{user:'error saving in user'});
              return next();
            }
            if(loggedInUser){
              loggedInUser.createSession(function(err, user){
                if(err){
                  res.send(400,{user:'error logging in user'});
                  return next();
                } else if(user){
                  user.password = '';
                  JSON.stringify(user);
                  res.send(200,{user: user});
                  //res.send(new Response.respondWithData(user));
                  return next();
                }
              });
            }
          });
        }
      });
    }
  });
}
exports.changepassword = function(req, res, next){
  var incomingUser = req.user;
    var user = req.body.user;
    console.log(incomingUser + "got user" + user);
    if(incomingUser.password == user.old){
        var oldUser = incomeingUser;
        console.log("old" + oldUser);
    }
}

//View Profile
exports.viewProfile = function(req, res, next){
    var id = req.params.id;
    User.findById(id,function(err,user){
        if(user != null && user != ""){
            res.send(200,{user: user});
            return next();
        }
        else{
            res.send(400,{user:'invalid user'});
            return next();
        }
    });
}


exports.loginuser = function(req, res, next){
  var user = req.body.user;
  var email = req.body.user.email;
  var password = user.password;
  if(typeof user.email == 'undefined' || user.email == ''){
      res.send(400,{user:'email is missing'});
  }
  if(typeof user.password == 'undefined' || user.password == ''){
    res.send(400,{user:'password is missing'});
    return next();
  }
  User.findOne({'email': user.email}  || {'password': user.password}, function(err, user){
    if(err){
      res.send(400,{user:'error lookingup user'});
      return next();
    } else if(!user) {
      res.send(400,{user:'No user exists'});
      return next();
    } else if(user){
      // var existing = common.decrypt(user.password);
      if (password !== user.password) {
          console.log("password unvalidate");
        console.log( Response.statusCode);
        res.send(400,{user:'Password is wrong'});
        return next();
      } else {
        user.createSession(function(err, user){
          if(err){
            res.send(400,{user:'error logging in user'});
            return next();
          } else if(user){
            console.log(Response.statusCode);
            res.send(200,{user: user});
            //res.send(new Response.respondWithData(user));
            return next();
          }
        });
      }
    }
  });
}

//Logout user
exports.logoutuser = function(req,res,next){
  var id = req.params.id;
  User.findById(id,function(err,user){
    if(user!= null && user!= ""){
      res.send("Logged out Successfully");
      return next();
    }
    else {
      res.send("Invalid User");
      return next();
    }
  });
}

exports.logoutuser1 = function(req, res, next){
    req.user.accessToken = '';

    req.user.save(function(err){
        if(err){
            return next(new restify.InternalError(err));
        } else {
            next(res.send(200));
            return next();
        }
    });
}




























