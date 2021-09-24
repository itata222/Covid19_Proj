import { DailyDataFunctions } from './repository/DailyData.js';
import { CityDataFunctions } from './repository/CityData.js'

const mainBox1Template = document.getElementById('mainBox1NewVerifiedTemplate').innerHTML
const mainBox1Container = document.getElementById('main-box1-newVerified-container')
const mainBox2Template = document.getElementById('mainBox2Template').innerHTML
const mainBox2Container = document.getElementById('main-box2-activeVerified-container')
const mainBox3Template = document.getElementById('mainBox3Template').innerHTML
const mainBox3Container = document.getElementById('main-box3-severePatients-container')
const mainBox4Template = document.getElementById('mainBox4Template').innerHTML
const mainBox4Container = document.getElementById('main-box4-vaccinated-container')
const mainBox5Template = document.getElementById('mainBox5Template').innerHTML
const mainBox5Container = document.getElementById('main-box5-totalDeaths-container')
const mainBox6Template = document.getElementById('mainBox6Template').innerHTML
const mainBox6Container = document.getElementById('main-box6-PercentageOfPositiveTests-container')

const ramzorCitiesTemplate = document.getElementById('ramzor-cities').innerHTML;
const ramzorCitiesContainer = document.getElementById('ramzor-table-inside-container')

const PercentageOfPositiveTestsGraph = document.getElementsByClassName('PercentageOfPositiveTests-graph')[0]
const totalDeathsSymbol = document.getElementsByClassName('totalDeaths-graph-container')[0];

let allCitiesArr = [], filterCitiesBy = '';


const getTodayData = async () => {
    const todayData = await DailyDataFunctions.DailyDataFuncs.getTodayData();
    renderInitial6Boxes(todayData);
    const todayAllCitiesData = await CityDataFunctions.CityDailyDataFuncs.getAllCitiesDailyStats();
    allCitiesArr = todayAllCitiesData.citiesToday
    renderRamzorCities()
}
getTodayData();

const renderInitial6Boxes = (todayDataFromDB) => {
    const mainBox1Rendered = Mustache.render(mainBox1Template, {
        newVerifiedYesterday: new Intl.NumberFormat().format(todayDataFromDB.yesterdayData.newVerified),
        newVerifiedMidNight: `${todayDataFromDB.todayData.newPatientsMidnight}${todayDataFromDB.todayData.newPatientsMidnight >= 0 ? '+' : '-'}`,
        newVerifiedAll: new Intl.NumberFormat().format(todayDataFromDB.todayData.allTimeSumVerified)
    })
    mainBox1Container.insertAdjacentHTML('beforeend', mainBox1Rendered)

    const mainBox2Rendered = Mustache.render(mainBox2Template, {
        verifiedSum: new Intl.NumberFormat().format(todayDataFromDB.todayData.activePatients),
        verifiedMidnight: `${todayDataFromDB.todayData.newPatientsMidnight}${todayDataFromDB.todayData.newPatientsMidnight >= 0 ? '+' : '-'}`,
        hospital: new Intl.NumberFormat().format(todayDataFromDB.todayData.isolationAtHospitals),
        hotel: new Intl.NumberFormat().format(todayDataFromDB.todayData.isolationAtHotels),
        home: new Intl.NumberFormat().format(todayDataFromDB.todayData.isolationAtHome)
    })
    mainBox2Container.insertAdjacentHTML('beforeend', mainBox2Rendered)

    const mainBox3Rendered = Mustache.render(mainBox3Template, {
        severePatientsAll: new Intl.NumberFormat().format(todayDataFromDB.todayData.severePatients),
        severePatientsMidNight: `${todayDataFromDB.todayData.severePatientsMidnight}${todayDataFromDB.todayData.severePatientsMidnight >= 0 ? '+' : '-'}`,
        criticalPatients: new Intl.NumberFormat().format(todayDataFromDB.todayData.criticalPatients),
        ventilatedPatients: new Intl.NumberFormat().format(todayDataFromDB.todayData.ventilatedPatients),
    })
    mainBox3Container.insertAdjacentHTML('beforeend', mainBox3Rendered)

    const mainBox4Rendered = Mustache.render(mainBox4Template, {
        vaccinatedFirst: new Intl.NumberFormat().format(todayDataFromDB.todayData.alltimeVaccinatedFirst),
        vaccinatedFirstMidnight: `${todayDataFromDB.todayData.vaccinatedFirstFromMidnight}${todayDataFromDB.todayData.vaccinatedFirstFromMidnight >= 0 ? '+' : '-'}`,
        vaccinatedSecond: new Intl.NumberFormat().format(todayDataFromDB.todayData.alltimeVaccinatedSecond),
        vaccinatedSecondMidnight: `${todayDataFromDB.todayData.vaccinatedSecondFromMidnight}${todayDataFromDB.todayData.vaccinatedSecondFromMidnight >= 0 ? '+' : '-'}`,
    })
    mainBox4Container.insertAdjacentHTML('beforeend', mainBox4Rendered)

    const mainBox5Rendered = Mustache.render(mainBox5Template, {
        totalDeaths: new Intl.NumberFormat().format(todayDataFromDB.todayData.totalDeaths),
    })
    mainBox5Container.insertAdjacentHTML('afterbegin', mainBox5Rendered)
    totalDeathsSymbol.className = "totalDeaths-graph-container";

    const mainBox6Rendered = Mustache.render(mainBox6Template, {
        PercentageOfPositiveTestsYesterday: `${String(todayDataFromDB.yesterdayData.newVerified * 100 / todayDataFromDB.yesterdayData.numberOfTests).substr(0, 4)}%`,
        sumTestsYesterday: new Intl.NumberFormat().format(todayDataFromDB.yesterdayData.numberOfTests)
    })
    mainBox6Container.insertAdjacentHTML('afterbegin', mainBox6Rendered)
    PercentageOfPositiveTestsGraph.className = "PercentageOfPositiveTests-graph";


}

const renderRamzorCities = () => {
    while (ramzorCitiesContainer.children.length > 0) {
        ramzorCitiesContainer.removeChild(ramzorCitiesContainer.lastChild)
    }

    let citiesFiltered = allCitiesArr.filter(({ city }) => {
        return city.includes(filterCitiesBy)
    })

    const html = Mustache.render(ramzorCitiesTemplate, {
        cities: citiesFiltered
    })
    ramzorCitiesContainer.insertAdjacentHTML('beforeend', html)

    const governmentScore = document.getElementsByClassName('government-score')
    const spotlightScore = document.getElementsByClassName('spotlight-score')
    const governmentScoreArr = Array.from(governmentScore)
    const spotlightScoreArr = Array.from(spotlightScore)

    governmentScoreArr.forEach(score => {
        switch (score.innerHTML) {
            case 'red':
                score.className = 'government-score-red';
                break;
            case 'yellow':
                score.className = 'government-score-yellow'
                break;
            case 'orange':
                score.className = 'government-score-orange'
                break;
            case 'green':
                score.className = 'government-score-green'
                break;
        }
        score.innerHTML = '';
    })

    spotlightScoreArr.forEach(score => {
        if (score.innerHTML < 4.5)
            score.className = 'spotlight-score-green';
        else if (score.innerHTML > 4.5 && score.innerHTML < 6)
            score.className = 'spotlight-score-yellow'
        else if (score.innerHTML > 6 && score.innerHTML < 7.5)
            score.className = 'spotlight-score-orange'
        else
            score.className = 'spotlight-score-red';
    })

    document.getElementsByClassName('ramzor-search-text')[0].addEventListener('input', () => {
        filterCitiesBy = document.getElementsByClassName('ramzor-search-text')[0].value.trim().toLowerCase()
        renderRamzorCities()
    })
}


