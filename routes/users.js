const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/dbconfig');

const User = require('../models/user');


//Register
router.post('/register',(req,res,next) =>{
   // res.send('REGISTER');
   let newUser = new user({
    name : req.body.name,
    email : req.body.email,
    password : req.body.password,
    username : req.body.username
   });

   user.addUser(newUser , (err,user) => {
        if(err){
            res.json({success : false , msg : 'User cannot be registered'});
        }else{
            res.json({success : true , msg : 'User is successfully registered'});
        }
   })
});

//Profile
router.get('/profile',(req,res,next) =>{
    res.send('PROFILE');
});


//VALIDATE
router.get('/validate',(req,res,next) =>{
    res.send('VALIDATE');
});


//AUTHENTICATE
router.post('/authenticate',(req,res,next) =>{
    const username = req.body.username;
    const password = req.body.password;

    User.getuserByName(username , (err,user) => {
        if(err) throw err;
        if(!user){
            return res.json({
                success : false,
                msg : 'user not found'
            })
        }
            User.ComparePassword(password , user.password , (err , IsMatch) =>{
                if(err) throw err;
                if(IsMatch){
                    const token = jwt.sign(user , config.secret , {
                        expiresIn : 3600
                    })
                    res.json({
                        success : true,
                        token : 'JWT'+ token,
                        user : {
                            id : user.id,
                            username : user.username,
                            email : user.email
                        }
                    })
                }else{
                 return res.json({
                success : false,
                msg : 'Not Authorized'
            })
                }
            });
    })
});

module.exports = router;