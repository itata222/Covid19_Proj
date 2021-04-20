const accessiblityButton = document.getElementById('accessibility-button')
const accessibilityText = document.getElementById('accessibility-text')
const bodyContainer = document.getElementById('body-container')
const cards = document.getElementsByClassName('main-box')
const arrayCards = Array.from(cards);
const svgPathsI = document.getElementsByClassName('i')
const arraySvgPathsI = Array.from(svgPathsI)
const PercentageOfPositiveTestsGraphSymbol = document.getElementsByClassName('PercentageOfPositiveTests-graph-symbol')[0];
const TotalDeathsGraphSymbol = document.getElementsByClassName('totalDeaths-graph-symbol')[0];
// console.log(TotalDeathsGraphSymbol)
const indicesTimeframeDropdownBox1 = document.getElementById('indices-timeframe-dropdown')
const indicesTimeframeDropdownBox2 = document.getElementById('indices-timeframe-dropdown2')
const indicesTimeframeDropdownBox3 = document.getElementById('indices-timeframe-dropdown3')
let indicesGraph1Data = {}, indicesGraph2Data = {}, indicesGraph3Data = {};


const ramzorCitiesTemplate = document.getElementById('ramzor-cities').innerHTML;
const ramzorCitiesContainer = document.getElementById('ramzor-table-inside-container')

const getVaccinatedDataURL = '/Covid19-site/GetDataPeriodOf?timeframe=';
const updateDataURL = '/Covid19-site/Admin/updateData'

const changeAccessibility = () => {
    bodyContainer.classList.toggle('layout-regular')
    bodyContainer.classList.toggle('layout-accessibility')
    accessibilityText.innerHTML.includes('תצוגה נגישה') ? accessibilityText.innerHTML = 'תצוגה רגילה' : accessibilityText.innerHTML = 'תצוגה נגישה';
    arrayCards.forEach(card => {
        card.classList.toggle('accessibility-main-box')
    });
    const mainBoxes = Array.from(document.getElementsByClassName("main-box"));
    mainBoxes.forEach(box => {
        box.classList.toggle('accessibility-main-box')
    })
    arraySvgPathsI.forEach(path => {
        path.classList.toggle('accessibility-Svg-path-I')
    });
    TotalDeathsGraphSymbol.classList.toggle('accessiblity-graph')
    PercentageOfPositiveTestsGraphSymbol.classList.toggle('accessiblity-graph')
}
accessiblityButton.addEventListener('click', changeAccessibility)


const getDataByDropDownLists = (BoxNumber, timeframe) => {
    let arrayOfDates = [], arrayOfVaccinatedFirst = [], arrayOfVaccinatedSecond = [];
    let arrayOfSumVaccinatedFirst = [], arrayOfSumVaccinatedSecond = [];
    let arrayOfPercentageVaccinateFirstWithinAllPopulation = [], arrayOfPercentageVaccinateSecondWithinAllPopulation = [];
    fetch(getVaccinatedDataURL + timeframe).then((res) => {
        if (res.ok)
            return res.json()
        else
            throw res
    }).then((data) => {
        let SumVaccinatedFirst = data[0].vaccinatedFirst, SumVaccinatedSecond = data[0].vaccinatedSecond;
        let frequancy, entirePopulation = 80000;
        switch (timeframe) {
            case 30:
                frequancy = 5
                break;
            case 14:
                frequancy = 3;
                break;
            case 7:
                frequancy = 1;
                break;
            default:
                frequancy = 10;
                break;

        }
        data.forEach((dayData, i) => {
            if (i % frequancy === 0) {
                let newDate = dayData.date.substring(0, dayData.date.length - 5)
                arrayOfDates.push(newDate)
            }
            else
                arrayOfDates.push('')
            arrayOfVaccinatedFirst.push(dayData.vaccinatedFirst)
            arrayOfVaccinatedSecond.push(dayData.vaccinatedSecond)
            for (let j = 0; j < i; j++) {
                SumVaccinatedFirst += data[j + 1].vaccinatedFirst;
                SumVaccinatedSecond += data[j + 1].vaccinatedSecond;
            }
            arrayOfSumVaccinatedFirst.push(SumVaccinatedFirst)
            arrayOfSumVaccinatedSecond.push(SumVaccinatedSecond)
            arrayOfPercentageVaccinateFirstWithinAllPopulation.push(arrayOfSumVaccinatedFirst[i] / entirePopulation)
            arrayOfPercentageVaccinateSecondWithinAllPopulation.push(arrayOfSumVaccinatedSecond[i] / entirePopulation)
        });

        // console.log(arrayOfDates)// console.log(arrayOfVaccinatedFirst)// 
        // console.log(arrayOfPercentageVaccinateSecondWithinAllPopulation)

        if (BoxNumber === 1) {
            indicesGraph1Data = {
                labels: arrayOfDates,
                series: [
                    arrayOfVaccinatedSecond,
                    arrayOfVaccinatedFirst,
                ]
            }
        }
        else if (BoxNumber === 2)
            indicesGraph2Data = {
                labels: arrayOfDates,
                series: [
                    arrayOfSumVaccinatedSecond,
                    arrayOfSumVaccinatedFirst,
                ]
            };
        else if (BoxNumber === 3)
            indicesGraph3Data = {
                labels: arrayOfDates,
                series: [
                    arrayOfPercentageVaccinateSecondWithinAllPopulation,
                    arrayOfPercentageVaccinateFirstWithinAllPopulation
                ]
            };
        else {
            indicesGraph1Data = {
                labels: arrayOfDates,
                series: [
                    arrayOfVaccinatedSecond,
                    arrayOfVaccinatedFirst,
                ]
            }
            indicesGraph2Data = {
                labels: arrayOfDates,
                series: [
                    arrayOfSumVaccinatedSecond,
                    arrayOfSumVaccinatedFirst,
                ]
            };
            indicesGraph3Data = {
                labels: arrayOfDates,
                series: [
                    arrayOfPercentageVaccinateSecondWithinAllPopulation,
                    arrayOfPercentageVaccinateFirstWithinAllPopulation,
                ]
            }
        }
        const firstGraph = new Chartist.Bar('.ct-chart1', indicesGraph1Data, {
            stackBars: true,
            fullWidth: true,
            height: '259px',
            axisX: {
                showGrid: false,

            },
            axisY: {

            }
        })
        const secondGraph = new Chartist.Line('.ct-chart2', indicesGraph2Data, {
            low: 0,
            showArea: true,
            fullWidth: true,
            height: '259px',
            axisX: {
                showGrid: false
            }

        });
        const thirdGraph = new Chartist.Line('.ct-chart3', indicesGraph3Data, {
            high: 100,
            low: 0,
            fullWidth: true,
            height: '259px',
            // As this is axis specific we need to tell Chartist to use whole numbers only on the concerned axis
            axisY: {
                onlyInteger: true,
                offset: 20
            },
            axisX: {
                showGrid: false,
            }
        });
        // console.log('data recieved of', timeframe, 'days', data)
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

//-----------------------
//cities need to be an array of objects. each object possess data for a city !
const cities = [
    {
        city: 'תל אביב',
        activePatients: 41212,
        changeVerified: 32.4,
        percentagePositive: 42,
        newVerifiedFor10K: 25.5,
        dailyScore: 6.2,
        GovernmentScore: 1
    },
    {
        city: 'נס ציונה',
        activePatients: 17292,
        changeVerified: 72.4,
        percentagePositive: 12,
        newVerifiedFor10K: 2.5,
        dailyScore: 2.2,
        GovernmentScore: 4
    }
]
const html = Mustache.render(ramzorCitiesTemplate, {
    cities
})
ramzorCitiesContainer.innerHTML = html