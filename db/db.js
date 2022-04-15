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
  .from('UserTrips')
  .select('TripId')
  .where('UserId',userID)
  .then(rows => {
    return rows[0];
  });
}

const deleteTripIDFromUsers = async(userID) => {
  return db
  .from('UserTrips')
  .where('UserId',userID)
  .update('TripId',null);
}

const getBikeID = async(tripID) => {
  return db
  .from('Trips')
  .select('BikeBooked')
  .where('TripId',tripID)
  .then(rows => {
    return rows[0];
  });
}

const enterLastStationDocked = async(bikeID, stationID,dateStr) => {
  return db
  .from('Bikes')
  .where('BikeId', bikeID)
  .update('LastStationDocked',stationID)
  .update('LastStationDockedTimestamp',dateStr)
}


const enterDockingInfo = async(bikeID, dateStr,userID,stationID) => {
  return db
  .from('DockedBikes')
  .where('BikeId',bikeID)
  .update('DockingTime',dateStr)
  .update('DockedBy',userID)
  .update('StationId',stationID)
}

const updateTripDetails = async(tripID, stationID,dateStr,tripStatus,journeyBill,paymentStatus) => {
  return db
  .from('Trips')
  .where('TripId',tripID)
  .update('ToLocation',stationID)
  .update('EndTime',dateStr)
  .update('TripStatus',tripStatus)
  .update('JourneyBill',journeyBill)
  .update('PaymentStatus',paymentStatus)
}

// const enterEndtime = async(tripID, dateStr) => {
//   return db
//   .from('Trips')
//   .where('TripID', '=', tripID)
//   .update({
//     'Endtime':dateStr
//   })
// }

// const enterTripStatus = async(tripID, tripStatus) => {
//   return db
//   .from('Trips')
//   .where('TripID', '=', tripID)
//   .update({
//     'TripStatus':tripStatus
//   })
// }

// const enterJourneyBill = async(tripID, journeyBill) => {
//   return db
//   .from('Trips')
//   .where('TripID', '=', tripID)
//   .update({
//     'JourneyBill':journeyBill
//   })
// }

// const enterPaymentStatus = async(tripID, paymentStatus) => {
//   return db
//   .from('Trips')
//   .where('TripID', '=', tripID)
//   .update({
//     'PaymentStatus':paymentStatus
//   })
// }

const getStartTime = async(tripID) => {
  return db
  .from('Trips')
  .select('StartTime')
  .where('TripId',tripID)
  .then(rows => {
    return rows[0]
  })
}

module.exports = {
  AddBike,
  AddDockedBike,
  checkUserBookStatus,
  getAvailableBikes,
  checkEmail,
  changeBikeStatus,
  StartTrip,
  getTripID,
  deleteTripIDFromUsers,
  getBikeID,
  enterLastStationDocked,
  enterDockingInfo,
  updateTripDetails,
  getStartTime
};