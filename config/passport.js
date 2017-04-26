const JWTStrategy  = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const user = require('../models/user');
const config = require('../config/dbconfig');
var JWT_STRATEGY_CONFIG = {
  jwtFromRequest: extractJwt.fromAuthHeader(),
  secretOrKey: config.secret,
};
module.exports = function(passport){
    let opts = {};
    opts.jwtFrontRequest = extractJwt.fromAuthHeader();
    opts.secretKey = config.secret;
    passport.use(new JWTStrategy(JWT_STRATEGY_CONFIG,(jwt_payload, done ) =>{
      user.getuserById(jwt_payload._id , (err,user) => {
            if(err){
                return done(err , false); 
            }
            if(user){
                return done(null , user);
            }else{
                return done(null , false);
            }
      })
    }));

}

