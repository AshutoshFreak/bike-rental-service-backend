const knex = require('knex');
const knexfile = require('./knexfile');
const moment = require('moment');

const db = knex(knexfile.development);
module.exports = db;


const AddBike = async(bike) => {
    return db
        .insert(bike)
        .into("Bikes")
        .returning("BikeId")
        .then(function(BikeId) {
            id = BikeId[0]
            console.log(id['BikeId']);
            AddDockedBike({ BikeId: id['BikeId'], StationId: 1 })
        });

};

const AddDockedBike = async(bike) => {
    return db
        .insert(bike)
        .into("DockedBikes")
        .returning("*")
        .then(rows => {
            return rows[0];
        });

};

const checkUserBookStatus = async(userid) => {
    return db
        .from('UserTrips')
        .select('TripId')
        .where('UserId', userid)
        .then(rows => {
            if (rows.length == 0) {
                return 0;
            } else {
                if (rows[0]['TripId'] == null) {
                    return 0;
                } else {
                    return 1;
                }
            }
        });
}

const checkBikeAvailability = async(bikeid) => {
    return db
        .from('Bikes')
        .select('BikeStatus')
        .where('BikeId', bikeid)
        .then(rows => {
            return rows[0]['BikeStatus']
        });
}

const getBikeLocation = async(bikeid) => {
    return db
        .from('Bikes')
        .select('LastStationDocked')
        .where('BikeId', bikeid)
        .then(rows => {
            return rows[0]['LastStationDocked']
        });
}

const getAvailableBikes = async(station) => {
    return db
        .from('Bikes')
        .select('BikeId')
        .where('BikeStatus', 0)
        .andWhere('LastStationDocked', station)
        .returning("*")
        .then(rows => {
            return rows[0];
        });
}

const EnterUserTrip = async(userid, tripid) => {
    return db
        .from('UserTrips')
        .returning("*")
        .where('UserId', userid)
        .update('TripId', tripid)
        .then(rows => {
            if (rows.length == 0) {
                return db
                    .insert({ 'UserId': userid, 'TripId': tripid })
                    .into("UserTrips")
                    .returning("*")
            }
        });
}

const AddmailID = async(EmailId) => {
    return db
        .from('Users')
        .returning("*")
        .where('EmailId', EmailId)
        .then(rows => {
            if (rows.length == 0) {
                return db
                    .insert({ 'EmailId': EmailId, 'MoneyDue': 0 })
                    .into("Users")
                    .returning("*")
            } else {
                return rows[0]
            }
        });
}



const changeBikeStatus = async(bikeid, status) => {
    return db
        .from('Bikes')
        .returning("*")
        .where('BikeId', bikeid)
        .update('BikeStatus', status)
        .then(rows => {
            return rows[0];
        });
}

const StartTrip = async(userid, bikeid, stationid) => {
    let dateStr = moment().utcOffset("+05:30").format();
    trip = { UserId: userid, BookedAtStation: stationid, BikeBooked: bikeid, StartTime: dateStr, TripStatus: 1 }
    return db
        .insert(trip)
        .into("Trips")
        .returning("*")
        .then(rows => {
            return rows[0]['TripId'];
        });
}

const checkEmail = async(email) => {
    return db.select("EmailId")
        .from("Users")
        .where("EmailId", email)
        .then(emailList => {
            if (emailList.length === 0) {
                return false;
            } else {
                return true;
            }
        });
}

const getTripID = async(userID) => {
    return db
        .from('UserTrips')
        .select('TripId')
        .where('UserId', userID)
        .then(rows => {
            return rows[0];
        });
}

const deleteTripIDFromUsers = async(userID) => {
    return db
        .from('UserTrips')
        .where('UserId', userID)
        .update('TripId', null);
}

const getBikeID = async(tripID) => {
    return db
        .from('Trips')
        .select('BikeBooked')
        .where('TripId', tripID)
        .then(rows => {
            return rows[0];
        });
}

const enterLastStationDocked = async(bikeID, stationID, dateStr) => {
    return db
        .from('Bikes')
        .where('BikeId', bikeID)
        .update('LastStationDocked', stationID)
        .update('LastStationDockedTimestamp', dateStr)
}


const enterDockingInfo = async(bikeID, dateStr, userID, stationID) => {
    return db
        .from('DockedBikes')
        .where('BikeId', bikeID)
        .update('DockingTime', dateStr)
        .update('DockedBy', userID)
        .update('StationId', stationID)
}

const updateTripDetails = async(tripID, stationID, dateStr, tripStatus, journeyBill, paymentStatus) => {
    return db
        .from('Trips')
        .where('TripId', tripID)
        .update('ToLocation', stationID)
        .update('EndTime', dateStr)
        .update('TripStatus', tripStatus)
        .update('JourneyBill', journeyBill)
        .update('PaymentStatus', paymentStatus)
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
        .where('TripId', tripID)
        .then(rows => {
            return rows[0]
        })
}

const getBikesCount = async() => {
    return db
        .from('Bikes')
        .where('BikeStatus', 0)
        .join('Stations', 'Stations.StationId', 'Bikes.LastStationDocked')
        .select('Bikes.LastStationDocked', 'Stations.StationName')
        .groupBy('LastStationDocked', 'StationName')
        .count()
}

const updateUserDetails = async(userID, journeyBill) => {
    return db
        .from('Users')
        .where('UserId', userID)
        .update('MoneyDue', journeyBill)
}

const getUserBill = async(userID) => {
    return db
        .from('Users')
        .select('MoneyDue')
        .where('UserId', userID)
        .then(rows => {
            return rows[0]
        })
}

const getStationLocations = async() => {
    return db
        .from('Stations')
        .select('StationId', 'Location')
        .then(rows => {
            return rows;
        })
}

module.exports = {
    AddBike,
    AddDockedBike,
    checkUserBookStatus,
    checkBikeAvailability,
    getBikeLocation,
    getAvailableBikes,
    EnterUserTrip,
    checkEmail,
    changeBikeStatus,
    StartTrip,
    getTripID,
    deleteTripIDFromUsers,
    getBikeID,
    enterLastStationDocked,
    enterDockingInfo,
    updateTripDetails,
    getStartTime,
    getBikesCount,
    updateUserDetails,
    getUserBill,
    getStationLocations,
    AddmailID
};