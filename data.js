const secondsInDay = 86400;
const DOT_SIZE = 3;
const SPACING_SIZE = 13;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let canvasWidth = canvas.clientWidth;
canvas.width = canvasWidth;
d3.json("https://api.covidtracking.com/v1/us/current.json").then(data => {
    let dateStringInfo = getDateStringFromDateInt(data[0].date);
    let dailyDeaths = data[0].deathIncrease;
    let totalDeaths = data[0].death;
    document.getElementById("title").innerHTML =
        "".concat(
            dateStringInfo,
            ', an American died of COVID-19 every ',
            Math.floor(secondsInDay / dailyDeaths),
            ' seconds.'
        );
    document.getElementById("total_deaths").innerHTML =
        "".concat(
            'There have been ',
            totalDeaths,
            ' COVID-19 deaths in the US since January 2020. What does this toll actually look like?'
        );
    
    let dots_per_row = Math.ceil(canvasWidth/(DOT_SIZE+SPACING_SIZE));
    let num_rows_need = (Math.floor(totalDeaths/dots_per_row));

    let canvasHeight = (num_rows_need * (DOT_SIZE+SPACING_SIZE));
    canvas.height = canvasHeight;

    // console.log(num_rows_need-1);
    // console.log(canvasHeight);

    let num_dots = 0;

    // rows
    for(let y = 0; y<canvasHeight; y+= DOT_SIZE+SPACING_SIZE){
        // cols
        for(let x = 0; x<canvasWidth; x+= DOT_SIZE+SPACING_SIZE){
            ctx.fillStyle = 'rgba(' + 0 + ',' + 0 + ',' + 0 + ',' + 1 + ')';
            ctx.fillRect(x, y, DOT_SIZE, DOT_SIZE);   
            num_dots++; 
        }
    }
    // console.log(totalDeaths);
    // console.log(num_dots);
});


function getDateStringFromDateInt(dateInt) {
    dateString = dateInt.toString();
    var year = dateString.substring(0, 4);
    var month = dateString.substring(4, 6);
    var day = dateString.substring(6, 8);
    var dateFromData = new Date(year, month - 1, day);
    var currentDate = new Date();
    if (dateFromData.getDate() === currentDate.getDate() - 1) {
        return "Yesterday, on ".concat(dateFromData.toDateString());
    }
    else if (dateFromData.getDate() === currentDate.getDate()) {
        return "Today, on ".concat(dateFromData.toDateString());
    }
    else {
        return "On ".concat(dateFromData.toDateString());
    }
}
