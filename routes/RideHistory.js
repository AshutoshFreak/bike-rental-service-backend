require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const {getBikesCount,getRideHistory,getStationNames} = require("../db/db");
const {extractTime} = require("../utils/extractTime");
const moment = require('moment');



// shorturl creation endpoint
module.exports = function (app) {
  app.post("/ride-history", async (req, res) => {
    userID = req.body.userid;
    const history = await getRideHistory(userID);
    if(history!=undefined){
        for(i=0;i<history.length;i++){
            startinfo = extractTime(history[i]["StartTime"]);
            endinfo = extractTime(history[i]["EndTime"]);
            history[i]["starttime"]=startinfo[0];
            history[i]["startdate"] = startinfo[1];
            history[i]["endtime"] = endinfo[0];
            history[i]["enddate"] = endinfo[1];
            history[i]["startstation"] = await getStationNames(history[i]["BookedAtStation"]);
            history[i]["endstation"] = await getStationNames(history[i]["ToLocation"]);
            delete history[i]["StartTime"];
            delete history[i]["EndTime"];
            delete history[i]["BookedAtStation"];
            delete history[i]["ToLocation"];
        }
        
        res.status(200).send(history);
    }
  })

};