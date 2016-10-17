var mongoose = require('mongoose');
var validator = require('validator');
var path = require('path');
var common = require('../helpers/common.js');
var statustypes = ["Active","Inactive"];


var userSchema = new mongoose.Schema({
  name      : {type: String, required: true},
  email     : {type: String, required: true, unique: true},
  phone     : {type: String, required: true, unique: true},
  password  : {type: String, required: true},
  accessToken: {type: String},
  status: {type:String,enum: statustypes},
  address   : {type: String},
  createdAt : {type: Date,default: Date.now},
  updatedAt : {type: Date}
},{collection:'user'});

userSchema.path('name').validate(function(value){
  return value && (value.length >= 3 && value.length <= 63);
}, 'name should between 3 and 63 character long');

userSchema.path('email').validate(function(value){
return validator.isEmail(value);
}, 'Invalid email');

userSchema.methods.createSession = function (cb) {
  this.updatedAt = new Date();
  this.accessToken = common.rand();
  this.save(cb);
};

var User = mongoose.model('user', userSchema);
module.exports = User;
