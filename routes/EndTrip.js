const { calculateJourneyBill } = require("../utils/billing");
const { TimeDiffInHours } = require("../utils/TimeDiff");
const {getDistanceFromLatLon} = require("../utils/CalculateDist")
const { lockBike } = require("./LockBike");
require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const {checkUserBookStatus, getTripID, deleteTripIDFromUsers, getBikeID,
        changeBikeStatus, enterLastStationDocked, enterDockingInfo, getStartTime ,updateTripDetails, enterJourneyBill, enterPaymentStatus,updateUserDetails,getStationLocations} = require("../db/db");
const moment = require('moment');



// shorturl creation endpoint
module.exports = function (app) {
  app.post("/end-trip", async (req, res) => {
    latitude = req.body.lat;
    longitude = req.body.long;
    userID = req.body.userid;
    
    const userhasbooked = await checkUserBookStatus(userID);
    if(userhasbooked>=1){
        //Location Checking
        stations = await getStationLocations();
        
        minDist = 1000000;
        index = -1;
        for (i = 0 ; i< stations.length; i++){

            dist = getDistanceFromLatLon(latitude,longitude,stations[i]["Location"]["x"],
            stations[i]["Location"]["y"])
            if(dist < minDist){
                  minDist = dist;
                  index = stations[i]["StationId"];
            }
        }
        if(minDist < 50){ // Threshold for being in a station location
            
        
          stationID = index;
          // in Users table
          let tripID = await getTripID(userID);
          tripID=tripID['TripId'];
          console.log(tripID)
          await deleteTripIDFromUsers(userID);
          // in Bikes table
          // [Not priority] need better naming scheme for functions and
          // code organisation so it doesn't require 3 calls to database
          let bikeID = await getBikeID(tripID);
          let dateStr = moment().utcOffset("+05:30").format();
          let dateStrNoTimeZone = new Date();
          console.log(bikeID)
          bikeID = bikeID['BikeBooked'];
          console.log(bikeID)
          await changeBikeStatus(bikeID, 0);
          await enterLastStationDocked(bikeID, stationID,dateStr); // Update Both Docked Stationa and Timestamp
              

          // in DockedBikes table
          // [Not priority] need better naming scheme for functions and
          // code organisation so it doesn't require 3 calls to database
          await enterDockingInfo(bikeID, dateStr,userID,stationID);
          
          
          // in Trips table
          // [Not priority] need better naming scheme for functions and
          // code organisation so it doesn't require 5 calls to database
          let journeyStartTime = await getStartTime(tripID);
          journeyStartTime=journeyStartTime['StartTime'];
          hours = TimeDiffInHours(journeyStartTime,dateStrNoTimeZone);
          let journeyBill = calculateJourneyBill(hours);
          await updateTripDetails(tripID, stationID,dateStr,2,journeyBill,0); // station ID, timestamp,tripstatus,bill,payment status
          await updateUserDetails(userID,journeyBill); //Updates Trip Bill on User Table
          // in SessionsPassword table
          // password should expire after trip has ended
          // expirePassword(tripID);

          // lock the bike after trip has ended
          lockBike(bikeID);

          // a successful response
          res.status(200).send("Trip Ended")
        }else{
          res.send("Please move closer to a station");
        }
    }else{
        res.send("User has not booked a bike");
    }
  })

};