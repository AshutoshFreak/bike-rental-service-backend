require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const {getUserMoneyDue} = require("../db/db");
const moment = require('moment');


// shorturl creation endpoint
module.exports = function (app) {
  app.post("/get-user-info", async (req, res) => {

    
    userID = req.body.userid;
    
    let due = await getUserMoneyDue(userID);
    due = due['MoneyDue']
    console.log(due)
    if(due=='0'){
        res.status(200).send("No previous dues");
    }else{
        res.status(200).send(`Previous dues remaining. Pay ${due} to keep enjoying our services`);
    }
  })

};