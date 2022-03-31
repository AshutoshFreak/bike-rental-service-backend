import { calculateJourneyBill } from "../utils/billing";
import { lockBike } from "./LockBike";
require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const {checkUserBookStatus, getTripID, deleteTripIDFromUsers, getBikeID,
        changeBikeStatus, enterLastStationDocked, enterLastStationDockedTimestamp,
        enterDockingTime, enterDockedBy, enterStationID, enterToLocation, 
        enterEndtime, changeTripStatus, enterJourneyBill, enterPaymentStatus} = require("../db/db");
const moment = require('moment');



// shorturl creation endpoint
module.exports = function (app) {
  app.post("/end-trip", async (req, res) => {
    stationID = req.body.stationid;
    userID = req.body.userid;
    
    const userhasbooked = await checkUserBookStatus(user);
    if(userhasbooked==1){

        // in Users table
        const tripID = await getTripID(userID);
        await deleteTripIDFromUsers(userID);

        // in Bikes table
        // [Not priority] need better naming scheme for functions and
        // code organisation so it doesn't require 3 calls to database
        let bikeID = getBikeID(tripID);
        let dateStr = moment().utcOffset("+05:30").format();
        await changeBikeStatus(bikeID, 0);
        await enterLastStationDocked(bikeID, stationID);
        await enterLastStationDockedTimestamp(bikeID, dateStr);

        // in DockedBikes table
        // [Not priority] need better naming scheme for functions and
        // code organisation so it doesn't require 3 calls to database
        await enterDockingTime(bikeID, dateStr);
        await enterDockedBy(bikeId, userID);
        await enterStationID(bikeID, stationID);
        
        // in Trips table
        // [Not priority] need better naming scheme for functions and
        // code organisation so it doesn't require 5 calls to database
        let journeyBill = calculateJourneyBill(hours);
        await enterToLocation(tripID, stationID);
        await enterEndtime(tripID, dateStr);
        await changeTripStatus(tripID, 0); // 0 means trip has ended
        await enterJourneyBill(tripID, journeyBill);
        await enterPaymentStatus(tripID, 0);  // 0 means payment due

        // in SessionsPassword table
        // password should expire after trip has ended
        // expirePassword(tripID);

        // lock the bike after trip has ended
        lockBike(bikeID);

        // a successful response
        res.status(200).send("Trip Ended")
    }else{
        res.send("User has not booked a bike");
    }
  })

};