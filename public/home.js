const accessiblityButton = document.getElementById('accessibility-button')
const accessibilityText = document.getElementById('accessibility-text')
const bodyContainer = document.getElementById('body-container')
const cards = document.getElementsByClassName('main-box')
const arrayCards = Array.from(cards);
const svgPathsI = document.getElementsByClassName('i')
const arraySvgPathsI = Array.from(svgPathsI)
const PercentageOfPositiveTestsGraphSymbol = document.getElementsByClassName('PercentageOfPositiveTests-graph-symbol')[0]
const TotalDeathsGraphSymbol = document.getElementsByClassName('totalDeaths-graph-symbol')[0]

const indicesTimeframeDropdownBox1 = document.getElementById('indices-timeframe-dropdown')
const indicesTimeframeDropdownBox2 = document.getElementById('indices-timeframe-dropdown2')
const indicesTimeframeDropdownBox3 = document.getElementById('indices-timeframe-dropdown3')
let indicesGraph1Data = {}, indicesGraph2Data = {}, indicesGraph3Data = {};

const getVaccinatedDataURL = '/Covid19-site/GetDataPeriodOf?timeframe='

const changeAccessibility = () => {
    bodyContainer.classList.toggle('layout-regular')
    bodyContainer.classList.toggle('layout-accessibility')
    accessibilityText.innerHTML.includes('תצוגה נגישה') ? accessibilityText.innerHTML = 'תצוגה רגילה' : accessibilityText.innerHTML = 'תצוגה נגישה';
    arrayCards.forEach(card => {
        card.classList.toggle('accessibility-main-box')
    });
    d3.selectAll("main-box").classList.toggle('accessibility-main-box')
    arraySvgPathsI.forEach(path => {
        path.classList.toggle('accessibility-Svg-path-I')
    });
    TotalDeathsGraphSymbol.classList.toggle('accessiblity-graph')
    PercentageOfPositiveTestsGraphSymbol.classList.toggle('accessiblity-graph')
}
accessiblityButton.addEventListener('click', changeAccessibility)


const getDataByDropDownLists = (BoxNumber, timeframe) => {
    let arrayOfDates = [], arrayOfVaccinatedFirst = [], arrayOfVaccinatedSecond = [];
    let GraphData;
    fetch(getVaccinatedDataURL + timeframe).then((res) => {
        if (res.ok)
            return res.json()
        else
            throw res
    }).then((data) => {

        data.forEach((dayData, i) => {
            if (i % 5 === 0) {
                let newDate = dayData.date.substring(0, dayData.date.length - 5)
                arrayOfDates.push(newDate)
            }
            else
                arrayOfDates.push('')
            arrayOfVaccinatedFirst.push(dayData.vaccinatedFirst)
            arrayOfVaccinatedSecond.push(dayData.vaccinatedSecond)
        });

        // console.log(arrayOfDates)// console.log(arrayOfVaccinatedFirst)// console.log(arrayOfVaccinatedSecond)

        if (BoxNumber === 1) {
            indicesGraph1Data = {
                labels: arrayOfDates,
                series: [
                    arrayOfVaccinatedFirst,
                    arrayOfVaccinatedSecond,
                ]
            }
        }
        else if (BoxNumber === 2)
            indicesGraph2Data = data;
        else if (BoxNumber === 3)
            indicesGraph3Data = data;
        else {
            indicesGraph1Data = {
                labels: arrayOfDates,
                series: [
                    arrayOfVaccinatedFirst,
                    arrayOfVaccinatedSecond,
                ]
            }
            indicesGraph2Data = data
            indicesGraph3Data = data
        }
        new Chartist.Bar('.ct-chart1', indicesGraph1Data, {
            stackBars: true,
            axisY: {
                // labelInterpolationFnc: function (value) {
                //     return (value / 1000) + 'k';
                // }
            },
            axisX: {
                // bla bla bla
            }
        }).on('draw', function (indicesGraph1Data) {
            if (indicesGraph1Data.type === 'bar') {
                indicesGraph1Data.element.attr({
                    style: 'stroke-width: auto'
                });
            }
        });
        console.log('indicesGraph1Data', indicesGraph1Data)

        console.log('data recieved of', timeframe, 'days', data)
    })

}

//---------chart1 data and settings----------
getDataByDropDownLists(0, 30)

indicesTimeframeDropdownBox1.addEventListener('change', () => {
    let timeframeINT;
    let currentTimeFrame = indicesTimeframeDropdownBox1.value;
    switch (currentTimeFrame) {
        case 'till-now':
            timeframeINT = -1;
            break;
        case 'last-week':
            timeframeINT = 7;
            break;
        case 'last-2weeks':
            timeframeINT = 14;
            break;
        case 'last-month':
            timeframeINT = 30;
            break;
    }
    getDataByDropDownLists(1, timeframeINT)
})
indicesTimeframeDropdownBox2.addEventListener('change', () => {
    let timeframeINT;
    let currentTimeFrame = indicesTimeframeDropdownBox2.value;
    switch (currentTimeFrame) {
        case 'till-now':
            timeframeINT = -1;
            break;
        case 'last-week':
            timeframeINT = 7;
            break;
        case 'last-2weeks':
            timeframeINT = 14;
            break;
        case 'last-month':
            timeframeINT = 30;
            break;
    }
    getDataByDropDownLists(2, timeframeINT)
})
indicesTimeframeDropdownBox3.addEventListener('change', () => {
    let timeframeINT;
    let currentTimeFrame = indicesTimeframeDropdownBox3.value;
    switch (currentTimeFrame) {
        case 'till-now':
            timeframeINT = -1;
            break;
        case 'last-week':
            timeframeINT = 7;
            break;
        case 'last-2weeks':
            timeframeINT = 14;
            break;
        case 'last-month':
            timeframeINT = 30;
            break;
    }
    getDataByDropDownLists(3, timeframeINT)
})

const secondGraph = new Chartist.Line('.ct-chart2', {
    labels: [1, 2, 3, 4, 5, 6, 7, 8],
    series: [
        [5, 9, 7, 8, 5, 3, 5, 4]
    ]
}, {
    low: 0,
    showArea: true
});

const thirdGraph = new Chartist.Line('.ct-chart3', {
    labels: [1, 2, 3, 4, 5, 6, 7, 8],
    series: [
        [1, 2, 3, 1, -2, 0, 1, 0],
        [-2, -1, -2, -1, -3, -1, -2, -1],
    ]
}, {
    high: 3,
    low: -3,
    fullWidth: true,
    // As this is axis specific we need to tell Chartist to use whole numbers only on the concerned axis
    axisY: {
        onlyInteger: true,
        offset: 20
    }
});
//---------chart data and settings----------