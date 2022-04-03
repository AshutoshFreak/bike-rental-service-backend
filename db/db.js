const knex=require('knex');
const knexfile=require('./knexfile');
const moment = require('moment');

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

  const checkUserBookStatus = async(userid) =>{
      return db
      .from('Trips')
      .select('BikeBooked')
      .where('UserId',userid)
      .andWhere('TripStatus',1)
      .then(rows => {
        return rows.length;
      });
  }
  const getAvailableBikes = async(station) => {
    return db
      .from('Bikes')
      .select('BikeId')
      .where('BikeStatus',0)
      .andWhere('LastStationDocked',station)
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  }

  const getBookedBike = async(userid) => {
    return db
      .from('Trips')
      .select('BikeBooked')
      .where('UserId',userid)
      .andWhere('TripStatus',1)
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  }


  const changeBikeStatus = async(bikeid) => {
        return db
      .from('Bikes')
      .returning("*")
      .where('BikeId',bikeid)
      .update('BikeStatus',1)
      .then(rows => {
        return rows[0];
      });

  }

  const StartTrip = async(userid,bikeid,stationid) => {
        let dateStr = moment().utcOffset("+05:30").format();
        trip={UserId:userid,BookedAtStation:stationid,BikeBooked:bikeid,StartTime:dateStr,TripStatus:1}
        return db
        .insert(trip)
        .into("Trips")
        .returning("*")
        .then(rows => {
          return rows[0];
      });
  }

  const EndTrip = async(userid,stationid) => {
    let dateStr = moment().utcOffset("+05:30").format();

    return db
      .from('Trips')
      .returning("*")
      .where('UserId',userid)
      .andWhere('TripStatus',1)
      .update('TripStatus',2)
      .update('EndTime',dateStr)
      .update('JourneyBill',10)
      .update('PaymentStatus',1)
      .then(rows => {
        return rows[0];
    

  });
}

const DockBike = async(bikeid,stationid) => {
  let dateStr = moment().utcOffset("+05:30").format();

  return db
    .from('Bikes')
    .returning("*")
    .where('BikeId',bikeid)
    .update('BikeStatus',0)
    .update('LastStationDocked',stationid)
    .update('LastStationDockedTimestamp',dateStr)
    .then(rows => {
      return rows[0];
  

});
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

  const getBikesCount =async()=>{
    return db
    .from('Bikes')
    .select('LastStationDocked')
    .where('BikeStatus',0)
    .groupBy('LastStationDocked')
    .count()
  }

  
  module.exports = {
    AddBike,
    AddDockedBike,
    checkUserBookStatus,
    getAvailableBikes,
    getBookedBike,
    changeBikeStatus,
    StartTrip,
    EndTrip,
    DockBike,
    checkEmail,
    getBikesCount
  };