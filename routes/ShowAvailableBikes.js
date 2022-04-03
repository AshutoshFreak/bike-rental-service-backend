require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const {getBikesCount} = require("../db/db");
const moment = require('moment');



// shorturl creation endpoint
module.exports = function (app) {
  app.get("/show-avail-bikes", async (req, res) => {
    const info = await getBikesCount();
    if(info!=undefined){
        res.status(200).send(info);
    }
  })

};