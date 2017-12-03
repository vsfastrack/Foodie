const express = require('express');
const router = express.Router();
const otplib = require('otplib').default;
const nodemailer = require('nodemailer');

otplib.authenticator.options = {
   step: 30
}
const opts = otplib.authenticator.options;
const secret = otplib.authenticator.generateSecret();
 
var token;

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: '[NODE_MAILER_USERNAME]',
        pass: '[NODE_MAILER_PASSWORD]]'
    }
});

router.post('/generateOTP',(req,res,next) =>{
    // setup email data with unicode symbols
token =  otplib.authenticator.generate(secret , opts);
let mailOptions = {
    from: '"[FROM]', // sender address
    to: req.body.email, // list of receivers
    subject: '[SUBJECT]', // Subject line
    text: '[CONTENT]', // plain text body
    html: '[HTML_MSG_CONTENT]' // html body
};
// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        res.json({success : false , msg : 'Sorry user cannot be verified'});
    }else{
        console.log('Message %s sent: %s', info.messageId, info.response);
        res.json({success : true , msg : 'OTP sent to your email !!! Please check your email'});    
    }
});
});

//verifyOTP
router.post('/verifyOTP',(req,res,next) =>{
   // res.send('REGISTER');
  //const  isValid = otplib.authenticator.check(token, secret);
    if(req && req.body && req.body.otp){
        if(req.body.otp == (token)){
             res.json({success : true , msg : 'User verified'});
        }else{
             res.json({success : false , msg : 'User cannot be verified'});
        }
    }
});

module.exports = router;