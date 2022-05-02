require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const {getBikesCount,insertUser} = require("../db/db");
const moment = require('moment');



// shorturl creation endpoint
module.exports = function (app) {
  app.post("/user-handle", async (req, res) => {
    const firebaseID = req.body.firebaseid;
    const emailID = req.body.email;
    const userID = await insertUser(emailID,firebaseID);
    if(userID!=undefined){
        res.status(200).send(userID);
    }
  })

};