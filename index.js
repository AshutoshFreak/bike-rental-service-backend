const express=require("express");
const app=express();
const  pool=require('./a');


app.use(express.json());

//add bike
app.post("/addbike",async(req,res)=>{
  try{
     const addbike=await pool.query(
        'INSERT INTO "Users" ("UserId","EmailId", "MoneyDue")  VALUES ($1, $2,$3)', [req.body.UserId, req.body.Emailid,req.body.MoneyDue]); 
        console.log(addbike);
  }catch(err)
  {
      console.err(err.message);
  }

})

//
app.get("/view",async(req,res)=>{
    try{
        const a=await pool.query('Select * from "Users"');
        console.log(a);
    }
    catch(err)
    {
        console.error(err.message);
    }
});
//create

// update 

//delete

app.listen(5000,()=>{
console.log('server is listening on port 5000');

})