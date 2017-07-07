const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/dbconfig');

const otplib = require('otplib').default;
const nodemailer = require('nodemailer');

otplib.authenticator.options = {
    step: 30
}
const opts = otplib.authenticator.options;
const secret = otplib.authenticator.generateSecret();

const User = require('../models/user');



var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',

    // Optional depending on the providers 
    httpAdapter: 'https', // Default 
    apiKey: 'AIzaSyDIbIVZhNhmTMS1FF-4WMS-XHBxGX4U8Rc', // for Mapquest, OpenCage, Google Premier 
    formatter: null         // 'gpx', 'string', ... 
};

var geocoder = NodeGeocoder(options);

var token;
function findGeoCodebyAddress(addressString) {
    google_geocoding.geocode(addressString, function (err, location) {
        if (err) {
            console.log('Error: ' + err);
        } else if (!location) {
            console.log('No result.');
        } else {
            console.log('Latitude: ' + location.lat + ' ; Longitude: ' + location.lng);
        }
    });
}
function findAddressbyGeoCoords(latitude, longitude, callback) {
    geocoder.reverse({ lat: latitude, lon: longitude }, function (err, res) {
        if (err) throw err;
        if (res) {
            var coords = [longitude , longitude];
            var address = {
                "streetNumber": res[0].streetNumber,
                "streetName": res[0].streetName,
                "city": res[0].city,
                "state": res[0].administrativeLevels.level1long,
                "zipCode": res[0].zipcode,
                "neighbourhood": res[0].neighborhood,
                "fullAddress": res[0].formattedAddress,
                "googlePlaceId": res[0].extra.googlePlaceId,
                "addressType" : "Home",
                "loc":{
                    coordinates : coords
                }
            };
            callback(err , address);
        }
   });
}

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'vebs6111992@gmail.com',
        pass: 'vebs661993'
    }
});
function sendOTPThorughMail(req, token) {
    let mailOptions = {
        from: '"no-reply@ShareSeat.com 👻" <vsfastrack@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: 'One TIme Password for verification for ShareSeat', // Subject line
        text: 'Hello world ?', // plain text body
        html: '<b>One Time Password For Signup Verification at Shareseat.com</b><h1>' + token + '</h1>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            //res.json({success : false , msg : 'Sorry user cannot be verified'});
            return false;
        } else {
            //console.log('Message %s sent: %s', info.messageId, info.response);
            //res.json({success : true , msg : 'OTP sent to your email !!! Please check your email'});
            saveUser()
            return true;
        }
    });
}
function generateAndSendOTP() {
    token = otplib.authenticator.generate(secret, opts);
    return token;
}
//Register
router.post('/register', (req, res, next) => {
    // res.send('REGISTER');
    generateAndSendOTP();

    //Sned otp to specified email:
    let mailOptions = {
        from: '"no-reply@ShareSeat.com 👻" <vsfastrack@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: 'One TIme Password for verification for ShareSeat', // Subject line
        text: 'Hello world ?', // plain text body
        html: '<b>One Time Password For Signup Verification at Shareseat.com</b><h1>' + token + '</h1>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json({ success: false, msg: 'Sorry user cannot be verified' });
            //return false;
        } else {
            //console.log('Message %s sent: %s', info.messageId, info.response);

            //module to save User
            let newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
                otp: token,
                IsVerified : false,
                createdDate : new Date()
            });

            User.addUser(newUser, (err, user) => {
                if (err) {
                    res.json({ success: false, msg: 'User cannot be registered' });
                } else {
                    res.json({ success: true, msg: 'User is successfully registered' });
                }
            })

            //res.json({success : true , msg : 'OTP sent to your email !!! Please check your email'});    
        }
    });
});

//verifyOTP
router.post('/verifyOTP', (req, res, next) => {
    // res.send('REGISTER');
    //const  isValid = otplib.authenticator.check(token, secret);
    if (req && req.body && req.body.otp && req.body.email) {
        User.verifyUser(req.body.email , req.body.otp , (err , user ) =>{
            if(err) throw err;
            else{
                 res.json({ success: true, msg: 'User is successfully verified' });
            }
        })
    }
});
//saveorUpdateAddress
router.post('/saveaddress', (req, res, next) => {
    if (req != null && req.body.address != null && req.body.address.loc != null && req.body.address.loc.lat != null && req.body.address.loc.long != null) {
        findAddressbyGeoCoords(req.body.address.loc.lat, req.body.address.loc.long, (err, data) => {
            if (err) throw err;
           // console.log("In the save address method" + data);
            User.updateAddress(req.body.email ,data, (err, user) => {
                if (err) {
                    res.json({ success: false, msg: 'User address cannot be saved' });
                } else {
                    res.json({ success: true, msg: 'User address Saved' });
                }
            });
            
        });
    }
});

module.exports = router;