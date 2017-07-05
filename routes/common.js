const express = require('express');
const router = express.Router();
const config = require('../config/dbconfig');

const Restro = require('../models/restaurant');

//FetchRestro
router.post('/fetchrestro', (req, res, next) => {
    console.log(req.body);
    //fetchRestro near user
    if(req != null && req.body != null && req.body.address != null){
        if(req.body.address.loc != null && req.body.address.loc.lat != null && req.body.address.loc.long != null ){
            Restro.findRestroByGeoCoordinates(req.body.address.loc.lat , req.body.address.loc.long , (err , res) =>{
            if(err)throw err;
            res.json({success : true , resultSet : data});
          });
        }
    }
});

module.exports = router;