require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const {AddBike, AddDockedBike, getAvailableBikes} = require("../db/db");
const moment = require('moment');



// shorturl creation endpoint
module.exports = function (app) {
  app.post("/add-bike", async (req, res) => {
    let BikeStatus = 0;
    let LastStationDocked = null;
    let LastStationDockedTimestamp=null;
    let dateStr = moment().utcOffset("+05:30").format()
    var bike= {BikeStatus:BikeStatus , LastStationDocked : LastStationDocked , LastStationDockedTimestamp:LastStationDockedTimestamp,CreatedAt : dateStr};
    const id=await AddBike(bike);
    const bikes = await getAvailableBikes();
    console.log(bikes)
    res.status(200).send("Bike Added Successfully");
    
  })

};