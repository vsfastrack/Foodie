const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/dbconfig');

const userSchema = mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type:String,
        required : true,
    },
    username:{
        type:String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    otp:{
        type : String
    }
});

const user = module.exports = mongoose.model('user',userSchema );

module.exports.getuserById = function(id , callback){
    user.findById(id,callback);
}

module.exports.getuserByName= function(username , callback){
   const query = {username : username};
    user.findOne(query , callback);
}

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
} 

module.exports.ComparePassword = function(candidatePassword , hash , callback){
    bcrypt.compare(candidatePassword , hash , (err,isMatch) =>{
        if(err) throw err;
        callback(null , isMatch);
    });
}