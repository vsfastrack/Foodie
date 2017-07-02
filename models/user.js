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
    }
});


module.exports.getuserById = function (id, callback) {
    user.findById(id, callback);
}

module.exports.getuserByName = function (username, callback) {
    const query = { username: username };
    user.findOne(query, callback);
}

module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
module.exports.updateAddress = function(address , callback){
    console.log("In the user method");
}
module.exports.ComparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}


const user = module.exports = mongoose.model('user', userSchema);