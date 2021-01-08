const secondsInDay = 86400;
const DOT_SIZE = 3;
const SPACING_SIZE = 12;

// api link for updating month: https://api.covidtracking.com/v1/us/20210101.json
let monthlyDeathData = [
    { month: "yesterday", deaths: 0 },
    { month: "february_2020", deaths: 5 },
    { month: "march_2020", deaths: 4313 },
    { month: "april_2020", deaths: 59577 },
    { month: "may_2020", deaths: 100495 },
    { month: "june_2020", deaths: 120061 },
    { month: "july_2020", deaths: 145347 },
    { month: "august_2020", deaths: 175612 },
    { month: "september_2020", deaths: 198925 },
    { month: "october_2020", deaths: 222319 },
    { month: "november_2020", deaths: 261789 },
    { month: "december_2020", deaths: 339407 },
    { month: "january_2021", deaths: 0 },
];

d3.json("https://api.covidtracking.com/v1/us/current.json").then(data => {
    let dateStringInfo = getDateStringFromDateInt(data[0].date);
    let dailyDeaths = data[0].deathIncrease;
    let totalDeaths = data[0].death;
    monthlyDeathData[monthlyDeathData.length - 1].deaths = totalDeaths;
    monthlyDeathData[0].deaths = dailyDeaths;
    for (let i = monthlyDeathData.length - 1; i > 0; i--) {
        if (monthlyDeathData[i].month !== 'february_2020') monthlyDeathData[i].deaths = monthlyDeathData[i].deaths - monthlyDeathData[i - 1].deaths;
        let headerID = monthlyDeathData[i].month.concat('_header');
        let currentString = document.getElementById(headerID).innerHTML;
        document.getElementById(headerID).innerHTML = currentString.concat(': ', numberWithCommas(monthlyDeathData[i].deaths), ' deaths');
    }
    document.getElementById("yesterday_header").innerHTML = dateStringInfo.concat(': ', numberWithCommas(dailyDeaths), ' deaths');
    document.getElementById("title").innerHTML =
        "".concat(
            dateStringInfo,
            ", </br>",
            "an American died of COVID-19 </br> every ",
            Math.floor(secondsInDay / dailyDeaths),
            ' seconds.'
        );
    document.getElementById("total_deaths").innerHTML =
        "".concat(
            numberWithCommas(totalDeaths),
            ' American lives have been lost to COVID-19 since January. What does this death toll actually look like?'
        );
    monthlyDeathData.forEach(month => {
        drawDotsOnCanvas(month.month, month.deaths);
    });
    let dots_per_row = Math.floor(document.getElementById('october').width / (DOT_SIZE + SPACING_SIZE));
    document.getElementById("row_legend").innerHTML =
        "each row = ".concat(
            dots_per_row + 1,
            " lives."
        );
});

function drawDotsOnCanvas(canvasId, numDots) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = getHeightFromWidthAndNumDots(canvas.width, numDots);
    let red = canvasId === 'yesterday' ? 255 : 0;
    let num_dots = 0;
    // rows
    for (let y = 0; y < canvas.height; y += (DOT_SIZE + SPACING_SIZE)) {
        // cols
        for (let x = 0; x < canvas.width; x += (DOT_SIZE + SPACING_SIZE)) {
            if (num_dots >= numDots) {
                break;
            }
            ctx.fillStyle = 'rgba(' + red + ',' + 0 + ',' + 0 + ',' + 1 + ')';
            ctx.fillRect(x, y, DOT_SIZE, DOT_SIZE);
            num_dots++;
        }

    }
}

function getDateStringFromDateInt(dateInt) {
    dateString = dateInt.toString();
    let year = dateString.substring(0, 4);
    let month = dateString.substring(4, 6);
    let day = dateString.substring(6, 8);
    let dateFromData = new Date(year, month - 1, day);
    let currentDate = new Date();
    let yesterday = new Date();
    yesterday.setDate(currentDate.getDate() - 1);
    let monthStr = dateFromData.toLocaleString('default', { month: 'long' })
    if (dateFromData.getDate() === yesterday.getDate()) {
        return "Yesterday, on ".concat(monthStr, ' ', day);
    }
    else if (dateFromData.getDate() === currentDate.getDate()) {
        return "Today, on ".concat(monthStr, '  ', day);
    }
    else {
        return "On ".concat(monthStr, ' ', day);
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getHeightFromWidthAndNumDots(width, numDots) {
    let dots_per_row = Math.ceil(width / (DOT_SIZE + SPACING_SIZE));
    let num_rows_need = (Math.ceil(numDots / dots_per_row));

    return (num_rows_need * (DOT_SIZE + SPACING_SIZE));
}