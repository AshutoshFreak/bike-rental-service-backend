require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const {AddBike, AddDockedBike, getAvailableBikes,checkEmail} = require("../db/db");
const moment = require('moment');
const e = require("express");



// shorturl creation endpoint
module.exports = function (app) {
  app.post("/login", async (req, res) => {
    let email = req.body.email;
    //var exists = checkEmail(email);
    if (await checkEmail(email)){
        res.send("User login successful");
    }else{
        res.send("Wrong Email");
    }

    
  })

};