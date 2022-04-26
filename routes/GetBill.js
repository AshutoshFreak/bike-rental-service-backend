require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const {getUserBill} = require("../db/db");
const moment = require('moment');



// shorturl creation endpoint
module.exports = function (app) {
  app.post("/get-bill", async (req, res) => {

    
    userID = req.body.userid;
    
    const bill = await getUserBill(userID);
    if(bill!=undefined){
        res.status(200).send(bill);
    }else{
        res.status(200).send("User not found");
    }
  })

};