require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const {AddBike, AddDockedBike, getAvailableBikes, changeBikeStatus, StartTrip, checkUserBookStatus,getBookedBike,EndTrip,DockBike} = require("../db/db");
const moment = require('moment');



// shorturl creation endpoint
module.exports = function (app) {
  app.post("/end-trip", async (req, res) => {
    station = req.body.stationid;
    user=req.body.userid;
    
    const userhasbooked = await checkUserBookStatus(user);
    if(userhasbooked!==0){

    
        const id=await getBookedBike(user); 
        if (id!==undefined){
        console.log(id)
        await EndTrip(user,station);
        await DockBike(id['BikeBooked'],station);
        res.status(200).send(id);
        }else{
            res.status(200).send("Error - No Trip going on")
        }
    

    }else{
        res.send("User has not booked a bike");
    }
  })

};