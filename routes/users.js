const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/dbconfig');
const commonlib_addressMapper = require('../common-utils/address-mapper');
const commonlib_mailer = require('../common-utils/mailer');
const commonlib_otpgenerator = require('../common-utils/otp-generator');
const commonlib_msgSender = require('../common-utils/mobile-msg-sender');
const commonlib_requestValidator = require('../common-utils/request-validator');
const commonlib_constants = require('../common-utils/constants');

const User = require('../models/user');

//Register
router.post('/register', (req, res, next) => {
  //generate_OTP
  commonlib_requestValidator.validate_request(req.body , new Array('email', 'phone'), (fieldList) => {
    /*if (err) throw err;*/
    if (fieldList != null) {
      commonlib_otpgenerator.generate_OTP((err, otp) => {
        if (err) throw err;
        if (otp) {
          if (req.body.phone != null) {
            commonlib_msgSender.send_msg(req.body.phone, commonlib_constants.VERIFICATION_MSG_TXT+otp, (err, data) => {
              if (err) throw err;
              populateUserModel(req, (userModel) => {
                //addUser Method
                if (userModel) {
                  saveUserToDb(userModel, (err, user) => {
                    if (err) {
                      res.json({
                        action : 'User Registration',
                        success: false,
                        statusCode : -101,
                        msg: 'User cannot be registered'
                      });
                    } else {
                      res.json({
                        action : 'User Registration',
                        success: true,
                        ststusCode : 101,
                        msg: 'User is successfully registered'
                      });
                    }
                  });
                }
              });
            });
          } else {
            commonlib_mailer.send_Mail(req.body.email, otp, (err, data) => {
              if (err) throw err;
              //res.json({ success: true, msg: 'OTP sent' + data });
              populateUserModel(req, (userModel) => {
                //addUser Method
                //addUser Method
                if (userModel) {
                  saveUserToDb(userModel, (err, user) => {
                    if (err) {
                      res.json({
                        success: false,
                        msg: 'User cannot be registered'
                      });
                    } else {
                      res.json({
                        success: true,
                        msg: 'User is successfully registered'
                      });
                    }
                  });
                }
              });
            });
          }
        }
      });
    }

  });

});

//verifyOTP
router.post('/verifyOTP', (req, res, next) => {
  if (req && req.body && req.body.otp) {
    commonlib_otpgenerator.verify_OTP(req.body.otp, (err, result) => {
      if (err) throw err;
      if (result) {
        if (req.body.email != null) {
          User.verifyUser(req.body.email, (err, result) => {
            res.json({
              success: true,
              msg: 'User verified'
            });
          });
        } else {
          res.json({
            success: false,
            msg: 'User verified email not sent'
          });
        }

      } else {
        res.json({
          success: true,
          msg: 'User not verified'
        });
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
          res.json({
            success: false,
            msg: 'User address cannot be saved'
          });
        } else {
          res.json({
            success: true,
            msg: 'User address Saved'
          });
        }
      });
    });
  }
});

router.post('/login', (req, res, next) => {
  if (req != null && req.body != null && req.body.password != null) {
    if (req.body.username != null) {
      findUserByUserName(req.body.username, (err, user) => {
        if (err) throw err;
        else if (user) {
          authenticateUser(req.body.password, user.password, (err, result) => {
            if (err) res.json({
              success: false,
              msg: 'User not authorised'
            });
            if (result) {

            }
          });
        } else res.json({
          success: false,
          msg: 'User not found'
        });
      });
    }
  }

});

//sendBillthorughMail
router.post('/sendBill', (req, res, next) => {
  // res.send('REGISTER');
  //const  isValid = otplib.authenticator.check(token, secret);
  if (req && req.body && req.body.bill && req.body.email) {
    commonlib_mailer.send_Mail(req.body.email, "This is test message", (err, data) => {
      if (err) throw err;
      res.json({
        success: true,
        msg: 'User address Saved' + data
      });
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

function saveUserToDb(userModel, callback) {
  User.addUser(userModel, (err, user) => {
    if (err) throw err;
    callback(null, user);
  });
}

module.exports = router;
