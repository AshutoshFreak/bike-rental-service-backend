require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const { AddBike } = require("./db/db");


app.use(express.json());
app.use(express.static('public'))

// Add Bike endpoint
require("./routes/AddBike")(app);
require("./routes/Login")(app);
require("./routes/BookBike")(app);
require("./routes/EndTrip")(app);
require("./routes/ShowAvailableBikes")(app);
require("./routes/GetBill")(app);
require("./routes/GetUserInfo")(app);
require("./routes/RideHistory")(app);

const Razorpay = require('razorpay'); 

const razorpayInstance = new Razorpay({
    key_id: 'FILL_KEY_ID_HERE',
    key_secret: 'FILL_KEY_SECRET_HERE',
});

app.post('/createOrder', (req, res)=>{ 
    const {amount,currency,receipt, notes}  = req.body;      
    razorpayInstance.orders.create({amount, currency, receipt, notes}, 
        (err, order)=>{
          
          if(!err)
            res.json(order)
          else
            res.send(err);
        }
    )
});

//Inside app.js
app.post('/verifyOrder',  (req, res)=>{ 
      
  // STEP 7: Receive Payment Data
  const {order_id, payment_id} = req.body;     
  const razorpay_signature =  req.headers['x-razorpay-signature'];

  // Pass yours key_secret here
  const key_secret = YAEUthsup8SijNs3iveeVlL1;     

  // STEP 8: Verification & Send Response to User
    
  // Creating hmac object 
  let hmac = crypto.createHmac('sha256', key_secret); 

  // Passing the data to be hashed
  hmac.update(order_id + "|" + payment_id);
    
  // Creating the hmac in the required format
  const generated_signature = hmac.digest('hex');
    
    
  if(razorpay_signature===generated_signature){
      res.json({success:true, message:"Payment has been verified"})
  }
  else
  res.json({success:false, message:"Payment verification failed"})
});

app.get("/", (req, res) => {
    res.send("Welcome to Bike Rental Service");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ` + port);
});