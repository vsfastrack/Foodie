var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',

    // Optional depending on the providers 
    httpAdapter: 'https', // Default 
    apiKey: 'AIzaSyDIbIVZhNhmTMS1FF-4WMS-XHBxGX4U8Rc', // for Mapquest, OpenCage, Google Premier 
    formatter: null         // 'gpx', 'string', ... 
};

var geocoder = NodeGeocoder(options);

module.exports = {
    address_geoCode : function findGeoCodebyAddress(addressString , callback) {
    google_geocoding.geocode(addressString, function (err, location) {
        if (err) throw err;
        callback(err , location);
    });
},
address_reversegeoCode : function findAddressbyGeoCoords(latitude, longitude, callback) {
    geocoder.reverse({ lat: latitude, lon: longitude }, function (err, res) {
        if (err) throw err;
        if (res) {
            var coords = [latitude , longitude];
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
}

