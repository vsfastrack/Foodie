const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/dbconfig');

const restroSchema = mongoose.Schema({
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
    otp: String,
    contactNumber: [
        {
            areaCode: String,
            phoneNumber: String,
            Ismobile: Boolean,
            IsLandline: Boolean,
            contactType: String
        }
    ],
    addrerss:
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
        countryCode: String,
        "googlePlaceId": String
    },
    loc: {
        type: { type: String },
        coordinates: [Number]
    },
    foodbucket: {
        category: [
            {
                categoryName: String,
                categoryId: Number,
                CategoryItems: [
                    {
                        imageUrl: String,
                        name: String,
                        price: Number,
                        avergaeRating: Number
                    }
                ]
            }
        ]
    },
    averageDeliveryDiatance: Number,
    averageDeliveryTime: Number,
    averageRating: Number,
    restroOpenTime: String,
    restroCloseTime: String,
    IsVerified: Boolean,
    createdDate: Date
});


//var newUser = new user();
var Restro = mongoose.model('Restro', restroSchema);

restroSchema.statics.findRestroByGeoCoordinates = function (latitude, longitude, callback) {
    console.log("Hello");
    mongoose.set('debug', true);
    restroSchema.aggregate({ "$geoNear": { "near": { "type": "Point", "coordinates": [ longitude, null ] }, "distanceField": "distance", "sperical": true, "maxDistance": 10000 } })
}

const restro = module.exports = mongoose.model('restro', restroSchema);