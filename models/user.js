const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/dbconfig');
/*const order = require('./order');*/



const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp : String,
    contactNumber: [
        {
            areaCode: String,
            phoneNumber: String,
            Ismobile: Boolean,
            IsLandline: Boolean,
            contactType: String
        }
    ],
    addrerssList: [
        {
            buildingName: String,
            streetName: String,
            streetNumber: String,
            locality: String,
            city: String,
            state: String,
            pincode: String,
            fullAddress: String,
            addressType: String,
            countryCode : String,
            loc: {
                type: { type: String },
                coordinates: [Number]
            },
            "googlePlaceId":String
        }
    ],
    shoppingList: [{
        bill:{
            totalPrice: Number,
            IsCouponApplied: Boolean,
            couponCode: String,
            isTempBill: Boolean,
            IsFinalBill: String,
            deduction: {
                isFixedType: Boolean,
                isPercentType: Boolean,
                deduction: Number
            },
            taxPayable: Number,
            amtPayable: Number
        },
        foodItem :{
                imageUrl: String,
                name: String,
                category: String,
                price: Number
        }
    }],
    cart: {
        currentBill: {
            totalPrice: Number,
            IsCouponApplied: Boolean,
            couponCode: String,
            isTempBill: Boolean,
            IsFinalBill: String,
            deduction: {
                isFixedType: Boolean,
                isPercentType: Boolean,
                deduction: Number
            },
            taxPayable: Number,
            amtPayable: Number
        },
        currentItems: [
            {
                imageUrl: String,
                name: String,
                category: String,
                price: Number
            }
        ]
    },
    IsVerified : Boolean,
    createdDate : Date
});


//var newUser = new user();
var User = mongoose.model('User' , userSchema);

module.exports.getuserById = function (id, callback) {
    user.findById(id, callback);
}

module.exports.getuserByName = function (username, callback) {
    const query = { username: username };
    user.findOne(query, callback);
}

userSchema.statics.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

userSchema.statics.updateAddress = function(email , address , callback){
    mongoose.set('debug', true);
    var query = { email: email };
    var options = {upsert : true};
    //User.Update(query, {$push: { addrerssList : address }}, options, function(err){console.log(err);})     
    User.findOneAndUpdate(query, {$push: { addrerssList : address }}, options, callback)
}
userSchema.statics.verifyUser = function(email , otp , callback){
    mongoose.set('debug', true);
    var conditions = { $and: [ { email : email }, { otp : otp } ] }
    var update = {$set : [{otp : null} , {IsVerified : true}]}
    User.update(conditions, update, callback)
/*    var query =  { $and: [ { email : email }, { otp : otp } ] }
    User.findOneAndUpdate(query, {$set:[{ otp : null } , {IsVerified : true}]}, callback)*/
}

module.exports.ComparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}

const user = module.exports = mongoose.model('user', userSchema);

