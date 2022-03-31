const knex=require('knex')
const knexfile=require('./knexfile')

const db=knex(knexfile.development);
module.exports=db;


const AddBike = async (bike) => {
    return db
      .insert(bike)
      .into("Bikes")
      .returning("BikeId")
      .then(function(BikeId) {
        id=BikeId[0]
        console.log(id['BikeId']);
         AddDockedBike({BikeId:id['BikeId'],StationId:1})
      });
    
  };
  
const AddDockedBike = async (bike) => {
    return db
      .insert(bike)
      .into("DockedBikes")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
    
  };

  const getAvailableBikes = async() => {
    return db
      .from('Bikes')
      .select('BikeId','LastStationDocked')
      .where('BikeStatus',0)
      .returning("*")
      .then(rows => rows);
  }

  const checkEmail = async(email)=>{
    return db.select("EmailId")
    .from("Users")
    .where("EmailId", email)
    .then(emailList => {
        if (emailList.length === 0) {
            return false;
        }else{
            return true;
        }
    
    
});
  }

  
  module.exports = {
    AddBike,
    AddDockedBike,
    getAvailableBikes,
    checkEmail
  };