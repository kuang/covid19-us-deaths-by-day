let dailyDeaths = 0;
let secondsInDay = 86400;

d3.json("https://api.covidtracking.com/v1/us/current.json").then(data => {
    let dateStringInfo = getDateStringFromDateInt(data[0].date);
    dailyDeaths = data[0].deathIncrease;
    totalDeaths = data[0].death;
    document.getElementById("title").innerHTML =
        "".concat(
            dateStringInfo,
            ', an American died of Covid-19 every ',
            Math.floor(secondsInDay / dailyDeaths),
            ' seconds.'
        );
    
});


function getDateStringFromDateInt(dateInt) {
    dateString = dateInt.toString();
    var year = dateString.substring(0, 4);
    var month = dateString.substring(4, 6);
    var day = dateString.substring(6, 8);
    var dateFromData = new Date(year, month - 1, day);
    var currentDate = new Date();
    if (dateFromData.getDate() === currentDate.getDate()-1) {
        return "Yesterday, on ".concat(dateFromData.toDateString());
    }
    else if (dateFromData.getDate() === currentDate.getDate()){
        return "Today, on ".concat(dateFromData.toDateString());
    }
    else {
        return "On ".concat(dateFromData.toDateString());
    }
}