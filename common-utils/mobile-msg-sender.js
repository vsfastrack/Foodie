var https = require('https');
const MSG_API_KEY = 'babde38e';
const MSG_API_SECRET = 'aabc3598311d9e70';
const MSG_SENDER = '+918384882725';

var options = {
  host: 'rest.nexmo.com',
  path: '/sms/json',
  port: 443,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

module.exports = {
  send_msg: function sendMsgByPhone(rec_contact, msg_to_be_sent, callback) {

    var data = JSON.stringify({
      api_key: MSG_API_KEY,
      api_secret: MSG_API_SECRET,
      to: '+91'+rec_contact,
      from: MSG_SENDER,
      text: msg_to_be_sent
    });

    options.headers['Content-Length'] = Buffer.byteLength(data);

    var req = https.request(options);
    req.write(data);
    req.end();

    var responseData = '';
    req.on('response', function (res) {
      res.on('data', function (chunk) {
        responseData += chunk;
      });

      res.on('end', function () {
        console.log(JSON.parse(responseData));
        console.log(responseData);
        callback(null , responseData);
      });
    });
  }
}
