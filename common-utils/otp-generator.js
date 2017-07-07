/*const otplib = require('otplib').default;
const totp = require('otplib/totp').default;

otplib.authenticator.options = {
    step: 30
}
const opts = otplib.authenticator.options;
const secret = otplib.authenticator.generateSecret();
var isValid;
var token;*/
var OTP = require('otp.js');
var GA = OTP.googleAuthenticator;


module.exports = {
    generate_OTP: function genOTP(callback) {
        try {
            // generate otp for base 32 encoded user secret 
            var code = GA.gen(GA.encode('JEQG2IDBEBSHEZLBNVSXE==='));
            callback(null , code) // print otp result => 6-digit number 
        }
        catch (ex) {
            callback(ex , null) // print error occurred during OTP generation process 
        }
    },
    verify_OTP: function verifyOTP(sent_token, callback) {
        try {
         var result = GA.verify(sent_token , GA.encode('JEQG2IDBEBSHEZLBNVSXE==='));
         callback(null , result)
        }
        catch (ex) {
            callback(ex , null) // print error occurred during OTP generation process 
        }
    }
}