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

const changeBikeStatus = async(bikeid, status) => {
      return db
    .from('Bikes')
    .returning("*")
    .where('BikeId',bikeid)
    .update('BikeStatus',status)
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

const getTripID = async(userID) => {
  return db
  .from('Users')
  .select('TripID')
  .where('UserID',userID);
}

const deleteTripIDFromUsers = async(userID) => {
  return db
  .from('Users')
  .where('UserID', '=', userID)
  .update({
    'TripID':null
  })
}

const getBikeID = async(tripID) => {
  return db
  .from('Trips')
  .select('BikeID')
  .where('TripID', '=', tripID)
}

const enterLastStationDocked = async(bikeID, stationID) => {
  return db
  .from('Bikes')
  .where('BikeID', '=', bikeID)
  .update({
    'LastStationDocked':stationID
  })
}

const enterLastStationDockedTimestamp = async(bikeID, dateStr) => {
  return db
  .from('Bikes')
  .where('BikeID', '=', bikeID)
  .update({
    'LastStationDockedTimestamp':stationID
  })
}

const enterDockingTime = async(bikeID, dateStr) => {
  return db
  .from('DockedBikes')
  .where('BikeID', '=', bikeID)
  .update({
    'DockingTime':dateStr
  })
}

const enterDockedBy = async(bikeID, userID) => {
  return db
  .from('DockedBikes')
  .where('BikeID', '=', bikeID)
  .update({
    'UserID':userID
  })
}

const enterStationID = async(bikeID, stationID) => {
  return db
  .from('DockedBikes')
  .where('BikeID', '=', bikeID)
  .update({
    'StationID':stationID
  })
}

const enterToLocation = async(tripID, stationID) => {
  return db
  .from('Trips')
  .where('TripID', '=', tripID)
  .update({
    'ToLocation':stationID
  })
}

const enterEndtime = async(tripID, dateStr) => {
  return db
  .from('Trips')
  .where('TripID', '=', tripID)
  .update({
    'Endtime':dateStr
  })
}

const enterTripStatus = async(tripID, tripStatus) => {
  return db
  .from('Trips')
  .where('TripID', '=', tripID)
  .update({
    'TripStatus':tripStatus
  })
}

const enterJourneyBill = async(tripID, journeyBill) => {
  return db
  .from('Trips')
  .where('TripID', '=', tripID)
  .update({
    'JourneyBill':journeyBill
  })
}

const enterPaymentStatus = async(tripID, paymentStatus) => {
  return db
  .from('Trips')
  .where('TripID', '=', tripID)
  .update({
    'PaymentStatus':paymentStatus
  })
}


module.exports = {
  AddBike,
  AddDockedBike,
  checkUserBookStatus,
  getAvailableBikes,
  checkEmail,
  changeBikeStatus,
  StartTrip
};