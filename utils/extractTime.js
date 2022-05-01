
const padding = num => ("0" + num).slice(-2);

function extractTime(timestamp) {
    var date = new Date(timestamp.getTime());
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var dateonly = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear(); 


    return [padding(hours) + ":" + padding(minutes),padding(dateonly)+ "-" + padding(month) + "-" + year];
}

module.exports = {
    extractTime
   };