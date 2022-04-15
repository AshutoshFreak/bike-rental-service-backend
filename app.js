require("dotenv").config({path: "./.env" });
const express = require("express");
const app = express();
const {AddBike} = require("./db/db");


app.use(express.json());


// Add Bike endpoint
require("./routes/AddBike")(app);
require("./routes/Login")(app);
require("./routes/BookBike")(app);
require("./routes/EndTrip")(app);

app.get("/", (req, res) => {
  res.send("Welcome to Bike Rental Service");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ` + port);
});
