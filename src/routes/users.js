const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');


const user = require('../models/user');


//Register
router.post('/register',(req,res,next) =>{
   // res.send('REGISTER');
   let newUser = new user({
    name : req.body.name,
    email : req.body.email,
    password : req.body.password,
    username : req.body.username
   });

   user.adduser(newUser , (err,user) => {
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
router.get('/authenticate',(req,res,next) =>{
    res.send('AUTHENTICATE');
});


module.exports = router;