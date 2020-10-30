const secondsInDay = 86400;
const DOT_SIZE = 2;
const SPACING_SIZE = 10;

let monthlyDeathData = [
    { month: "feburary", deaths: 8 },
    { month: "march", deaths: 5324 },
    { month: "april", deaths: 61356 },
    { month: "may", deaths: 101163 },
    { month: "june", deaths: 120762 },
    { month: "july", deaths: 146537 },
    { month: "august", deaths: 176639 },
    { month: "september", deaths: 199776 },
    { month: "october", deaths: 0 },
];

d3.json("https://api.covidtracking.com/v1/us/current.json").then(data => {
    let dateStringInfo = getDateStringFromDateInt(data[0].date);
    let dailyDeaths = data[0].deathIncrease;
    let totalDeaths = data[0].death;
    monthlyDeathData[monthlyDeathData.length - 1].deaths = totalDeaths;
    for (let i = monthlyDeathData.length - 1; i > 0; i--) {
        monthlyDeathData[i].deaths = monthlyDeathData[i].deaths - monthlyDeathData[i - 1].deaths;
    }
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
            numberWithCommas(totalDeaths),
            ' American lives lost to COVID-19 since January 2020. What does this death toll actually look like?'
        );
    monthlyDeathData.forEach(month => {
        drawDotsOnCanvas(month.month, month.deaths);
    });
    // drawDotsOnCanvas("october", 20647);
    let dots_per_row = Math.floor(document.getElementById('october').width / (DOT_SIZE + SPACING_SIZE));
    document.getElementById("row_legend").innerHTML = 
        "each row = ".concat(
            dots_per_row+1,
            " lives."
        );
});

function drawDotsOnCanvas(canvasId, numDots){
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = getHeightFromWidthAndNumDots(canvas.width, numDots);

    let num_dots = 0;
    // rows
    for(let y = 0; y<canvas.height; y+= (DOT_SIZE+SPACING_SIZE)){
        // cols
        for(let x = 0; x<canvas.width; x+= (DOT_SIZE+SPACING_SIZE)){
            if(num_dots>=numDots){
                break;
            }
            ctx.fillStyle = 'rgba(' + 0 + ',' + 0 + ',' + 0 + ',' + 1 + ')';
            ctx.fillRect(x, y, DOT_SIZE, DOT_SIZE);   
            num_dots++;
        }
        
    }   
}

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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getHeightFromWidthAndNumDots(width, numDots){
    let dots_per_row = Math.ceil(width / (DOT_SIZE + SPACING_SIZE));
    console.log(dots_per_row);
    let num_rows_need = (Math.ceil(numDots / dots_per_row));

    return (num_rows_need * (DOT_SIZE + SPACING_SIZE));


}