const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/dbconfig');


mongoose.connect(config.database);

mongoose.connection.on('connected', () =>{
    console.log('Connected to DB');
});

const app = express();

const port = 3000;

const users = require('./routes/users');
const otplib = require('./routes/otp');

app.use(cors());

app.use(bodyParser.json())

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
app.use('/users',users);
app.use('/otp',otplib);

app.get('/', function(req,res){
    res.send('Invalid endpoint');
});

//

app.listen(port, function(){
    console.log('Server started at port'+port);
});