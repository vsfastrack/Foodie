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

module.exports.adduser = function(newuser , callback){
    bcrypt.genSalt(10 , () =>{
        bcrypt.hash(newuser.password,genSalt,(err,hash) =>{
            if(err) throw err;
            newuser.password = hash;
            newuser.save(callback);
        });
    });
}