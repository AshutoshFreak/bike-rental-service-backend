const {Pool}=require('pg')
//const pool = require('pg/lib/native/pool')

const pool =new Pool({
  host :"bike-rental.c5wl4d118ddp.ap-south-1.rds.amazonaws.com",
  user: "postgres",
  port :5432,
  password: "test1234",
  database:"bike_rental"

})
module.exports=pool;
/*
const insertUser = async (userName, userRole,a) => {
  try {
       await pool.connect();           // gets connection
       await pool.query(
          `INSERT INTO "Users" ("UserId","EmailId", "MoneyDue")  
           VALUES ($1, $2,$3)`, [userName, userRole,a]); // sends queries
      return true;
  } catch (error) {
      console.error(error.stack);
      return false;
  } finally {
       await pool.end();               // closes connection
  }
};

insertUser(3,'Mtt', 1).then(result => {
  
      console.log('User inserted');
  
});
pool.connect();


pool.query('Select * from "Users"',(err,res)=>{
  if(!err){
    console.log(res.rows);
    console.log('hi');
  }
  else{
    console.log(err.message);
  }
  pool.end;
})
*/