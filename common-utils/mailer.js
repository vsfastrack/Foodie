const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'vebsrocks6693@gmail.com',
        pass: 'dummy@foodie'
    }
});

module.exports = {
    send_Mail : function sendMail(recv_mail_address , message ,callback){

        let mailOptions = {
        from: '"no-reply@Foodie.com 👻" <vebsrocks6693@gmail.com>', // sender address
        to: recv_mail_address, // list of receivers
        subject: 'One TIme Password for verification for Foodie', // Subject line
        text: 'Hello world ?', // plain text body
        html: '<b>One Time Password For Signup Verification at Shareseat.com</b><h1>' + message + '</h1>' // html body
       };

       transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        let mail_Status = {
           mail_status_OK : 200,
           mail_status_sent : true
       }
         callback(error , mail_Status);
       });
    }
}