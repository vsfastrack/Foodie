const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/dbconfig');
const commonlib_addressMapper = require('../common-utils/address-mapper');
const commonlib_mailer = require('../common-utils/mailer');
const commonlib_otpgenerator = require('../common-utils/otp-generator');

const User = require('../models/user');

//Register
router.post('/register', (req, res, next) => {
    //generate_OTP
    commonlib_otpgenerator.generate_OTP((err, otp) => {
        if (err) throw err;
        if (otp) {
            commonlib_mailer.send_Mail(req.body.email, otp, (err, data) => {
                if (err) throw err;
                //res.json({ success: true, msg: 'OTP sent' + data });
                populateUserModel(req, (userModel) => {
                    User.addUser(userModel, (err, user) => {
                        if (err) {
                            res.json({ success: false, msg: 'User cannot be registered' });
                        } else {
                            res.json({ success: true, msg: 'User is successfully registered' });
                        }
                    });
                });
            });
        }
    });
});

//verifyOTP
router.post('/verifyOTP', (req, res, next) => {
    if (req && req.body && req.body.otp) {
        commonlib_otpgenerator.verify_OTP(req.body.otp , (err , result) =>{
            if(err) throw err;
            if(result){
                if(req.body.email != null){
                    User.verifyUser(req.body.email , (err , result) =>{
                         res.json({ success: true, msg: 'User verified' });  
                    });
                }else{
                    res.json({ success: false, msg: 'User verified email not sent' });
                }
   
            }else{
              res.json({ success: true, msg: 'User not verified' });  
            }
        });
    }
});
//saveorUpdateAddress
router.post('/saveaddress', (req, res, next) => {
    if (req != null && req.body.address != null && req.body.address.loc != null && req.body.address.loc.lat != null && req.body.address.loc.long != null) {
        commonlib_addressMapper.address_reversegeoCode(req.body.address.loc.lat, req.body.address.loc.long, (err, data) => {
            if (err) throw err;
            User.updateAddress(req.body.email, data, (err, user) => {
                if (err) {
                    res.json({ success: false, msg: 'User address cannot be saved' });
                } else {
                    res.json({ success: true, msg: 'User address Saved' });
                }
            });
        });
    }
});

//AUTHENTICATE
router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    if (username != null) {
        User.getuserByName(username, (err, user) => {
            if (err) throw err;
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'user not found'
                })
            }
            User.ComparePassword(password, user.password, (err, IsMatch) => {
                if (err) throw err;
                if (IsMatch) {
                    const token = jwt.sign(user, config.secret, {
                        expiresIn: 3600
                    })
                    res.json({
                        success: true,
                        token: 'JWT' + token,
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email
                        }
                    })
                } else {
                    return res.json({
                        success: false,
                        msg: 'Not Authorized'
                    })
                }
            });
        })
    } else if (email != null) {
        User.getuserByEmail(email, (err, user) => {
            if (err) throw err;
            if (!user) {
                return res.json({
                    success: false,
                    msg: 'user not found'
                })
            }
            User.ComparePassword(password, user.password, (err, IsMatch) => {
                if (err) throw err;
                if (IsMatch) {
                    const token = jwt.sign(user, config.secret, {
                        expiresIn: 3600
                    })
                    res.json({
                        success: true,
                        token: 'JWT' + token,
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email
                        }
                    })
                } else {
                    return res.json({
                        success: false,
                        msg: 'Not Authorized'
                    })
                }
            });
        })
    }

});

//sendBillthorughMail
router.post('/sendBill', (req, res, next) => {
    // res.send('REGISTER');
    //const  isValid = otplib.authenticator.check(token, secret);
    if (req && req.body && req.body.bill && req.body.email) {
        commonlib_mailer.send_Mail(req.body.email, "This is test message", (err, data) => {
            if (err) throw err;
            res.json({ success: true, msg: 'User address Saved' + data });
        });
    }
});

/*********************************Utility methods for userModel***************************************/
function populateUserModel(req, callback) {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        IsVerified: false,
        createdDate: new Date()
    });
    callback(newUser);
}

module.exports = router;