require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const { AddBike, AddDockedBike, getAvailableBikes, checkEmail, AddmailID } = require("../db/db");
const moment = require('moment');
const e = require("express");


// const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

// dotenv.config();
//require("dotenv").config({ path: "./.env" });
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

app.use(express.json());

const users = [];

function upsert(array, item) {
    const i = array.findIndex((_item) => _item.email === item.email);
    if (i > -1) array[i] = item;
    else array.push(item);
}


module.exports = function(app) {
    app.post("/google-login", async(req, res) => {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });
        const { name, email, picture } = ticket.getPayload();
        upsert(users, { name, email, picture });
        res.status(201);
        console.log(name);
        console.log(email);
        const response = await AddmailID(email);
        const UserId = response['UserId'];
        res.json({
            UserId
        });

    })
};

// shorturl creation endpoint
// module.exports = function(app) {
//     app.post("/login", async(req, res) => {
//         let email = req.body.email;
//         //var exists = checkEmail(email);
//         if (await checkEmail(email)) {
//             res.send("User login successful");
//         } else {
//             res.send("Wrong Email");
//         }


//     })

// };