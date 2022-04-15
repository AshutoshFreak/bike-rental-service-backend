const _MS_PER_HOUR = 1000 * 60 * 60;

// a and b are javascript Date objects
function TimeDiffInHours(a, b) {
  // Discard the time and time-zone information.
  var timediff = (b.getTime() - a.getTime())/_MS_PER_HOUR;

  return timediff;
}

module.exports = {
    TimeDiffInHours
   };