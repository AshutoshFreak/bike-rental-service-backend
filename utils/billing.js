function calculateJourneyBill(hours) {
    perHourBill = 2;
    totalBill = Math.floor(perHourBill*hours);
    return totalBill
};


module.exports = {
   calculateJourneyBill
  };