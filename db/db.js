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

  
  module.exports = {
    AddBike,
    AddDockedBike,
    getAvailableBikes
  };