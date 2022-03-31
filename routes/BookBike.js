require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const {AddBike, AddDockedBike, getAvailableBikes, changeBikeStatus, StartTrip, checkUserBookStatus} = require("../db/db");
const moment = require('moment');



// shorturl creation endpoint
module.exports = function (app) {
  app.post("/book-bike", async (req, res) => {
    station = req.body.stationid;
    user=req.body.userid;
    
    const userhasbooked = await checkUserBookStatus(user);
    if(userhasbooked==0){

    
        const id=await getAvailableBikes(station); 
        if (id!==undefined){
        console.log(id)
        await changeBikeStatus(id['BikeId'], 1);
        await StartTrip(user,id['BikeId'],station) ;
        res.status(200).send(id);
        }else{
            res.status(200).send("No Bikes Available")
        }
    

    }else{
        res.send("User has already booked a bike");
    }
  })

};