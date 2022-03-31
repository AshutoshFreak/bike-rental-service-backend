const express=require("express");
const app=express();
const  pool=require('./a');


app.use(express.json());

//add bike
app.post("/addbike",async(req,res)=>{
  try{
     const addbike=await pool.query(
        'INSERT INTO "Bikes" ("BikeId","BikeStatus", "LastStationDocked","LastStationDockedTimestamp","CreatedAt")  VALUES ($1, $2,$3,$4,$5)', [req.body.BikeId, req.body.BikeStatus,req.body.LastStationDocked,req.body.LastStationDockedTimestamp,req.body.CreatedAt]); 
        console.log(addbike);
  }catch(err)
  {
      console.error(err.message);
  }

})//getbike
app.get("/getbike",async(req,res)=>{
    try{
        const a=await pool.query('Select * from "Bikes" where "BikeId"=$1',[req.body.bikeid]);
        console.log(a);
    }
    catch(err)
    {
        console.error(err.message);
    }
});

//delete

app.put("/removebike",async(req,res)=>{
    try{
        const a=await pool.query('DELETE FROM "Bikes" WHERE  "BikeId"=$1',[req.body.bikeid]);
       // console.log("Done");
    }
    catch(err)
    {
        console.error(err.message);
    }
});

app.get("/Bookbike",async(req,res)=>{
try{
    const a=await pool.query('Select * from "Bikes" where "BikeStatus"=1 and "LastStationDocked"=$1 limit 1',[req.body.stationid])
    console.log(a.rows[0].BikeId);
    await pool.query(' UPDATE "Bikes" SET "BikeStatus"=0 where "BikeId"=$1',[a.rows[0].BikeId]);
    await pool.query(
        'INSERT INTO "Trips" ("TripId","UserId","BikeBooked")  VALUES ($1, $2,$3)', [req.body.TripId, req.body.UserId,a.rows[0].BikeId]); 
}
catch(err)
{
    console.log(err.message);
}
})

app.get("/endTrip",async(req,res)=>{
    try{
        const a=await pool.query('Select * from "Bikes" where "BikeStatus"=1 and "LastStationDocked"=$1 limit 1',[req.body.stationid])
        console.log(a.rows[0].BikeId);
        await pool.query(' UPDATE "Bikes" SET "BikeStatus"=0 where "BikeId"=$1',[a.rows[0].BikeId]);
        await pool.query(
            'INSERT INTO "Trips" ("TripId","UserId","BikeBooked")  VALUES ($1, $2,$3)', [req.body.TripId, req.body.UserId,a.rows[0].BikeId]); 
    }
    catch(err)
    {
        console.log(err.message);
    }
    })

app.listen(5000,()=>{
console.log('server is listening on port 5000');

})
