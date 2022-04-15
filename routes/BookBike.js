require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const {AddBike, AddDockedBike, getAvailableBikes, changeBikeStatus, StartTrip, checkUserBookStatus,checkBikeAvailability,EnterUserTrip,getBikeLocation} = require("../db/db");
const moment = require('moment');
const {TimeDiffInHours} = require('../utils/TimeDiff')


// shorturl creation endpoint
module.exports = function (app) {
  app.post("/book-bike", async (req, res) => {
    bikeID = req.body.bikeid;
    userID=req.body.userid;
    
    const userhasbooked = await checkUserBookStatus(userID);
    if(userhasbooked==0){

      const bike_booked=await checkBikeAvailability(bikeID); 
      if (bike_booked==0){
        let stationID=await getBikeLocation(bikeID);
        await changeBikeStatus(bikeID, 1);
        tripID=await StartTrip(userID,bikeID,stationID);
        await EnterUserTrip(userID,tripID);
        res.status(200).send("Bike Booked");
        }else{
            res.status(200).send("Bike Not Available")
        }
    

    }else{
        res.status(200).send("User has already booked a bike");
    }
  })

};