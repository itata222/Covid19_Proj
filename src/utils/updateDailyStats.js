const schedule = require('node-schedule');
const CityDailyStats = require('../models/CityDailyStatsModel');
const DailyStatics = require('../models/DailyStaticsModel')

const updateDailyStats = (patient, todayStats) => {
    if (patient.condition !== 'healthy')
        todayStats.activePatients++;

    switch (patient.condition) {
        case 'Severe':
            todayStats.severePatients++;
            break;
        case 'Critical':
            todayStats.criticalPatients++;
            break;
        case 'Ventilated':
            todayStats.ventilatedPatients++;
            break;
    }
    switch (patient.qurantinedAt) {
        case 'Home':
            todayStats.isolationAtHome++;
            break;
        case 'Hospital':
            todayStats.isolationAtHospitals++;
            break;
        case 'Hotel':
            todayStats.isolationAtHotels++;
            break;
    }
}


const createDailyStatsEveryMidnight = () => {
    const job = schedule.scheduleJob('01 00 * * *', async function () {
        const today = new Date();
        const todayDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
        const newDayStatsData = {
            date: todayDate,
            activePatients: 0,
            isolationAtHotels: 0,
            isolationAtHospitals: 0,
            isolationAtHome: 0,
            criticalPatients: 0,
            ventilatedPatients: 0,
            severePatients: 0,
            totalDeaths: 0,
            vaccinatedFirst: 0,
            vaccinatedSecond: 0,
            numberOfTests: 0,
            newVerified: 0
        }
        const newDayStats = new DailyStatics(newDayStatsData)
        await newDayStats.save();
    });
}
createDailyStatsEveryMidnight()

createCityDataEveryMidnight = () => {
    const job = schedule.scheduleJob('01 00 * * *', async function () {
        const today = new Date();
        const todayDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
        const cityDailyStatsAll = await CityDailyStats.find({});
        const cityObj = {};

        for (let cityStats of cityDailyStatsAll) {
            let currentCity = cityStats.city
            cityObj[currentCity] = (cityObj[currentCity] || 0) + 1;
        }
        for (let city in cityobj) {
            const currentCityDailyStats = await CityDailyStats.find({ city });
            const newDayStatsData = {
                date: todayDate,
                city,
                numberOfResidents: currentCityDailyStats.numberOfResidents,
                currentActivePatients: 0,
                numberOfTests: 0,
                numberOfPositiveTests: 0,
                governmentScore: '',
                dailyScore: 0
            }
            const newDayStats = new CityDailyStats(newDayStatsData)
            await newDayStats.save();
        }
    });
}
createCityDataEveryMidnight()

// const createDailyStatsData = async () => {
//     for (let i = 60; i >= 0; i--) {
//         const today = new Date();
//         today.setDate(today.getDate() - i)
//         const todayDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
//         const newDayStatsData = {
//             date: todayDate,
//             activePatients: Math.floor(Math.random() * 5000) + 1,
//             isolationAtHotels: Math.floor(Math.random() * 500) + 1,
//             isolationAtHospitals: Math.floor(Math.random() * 100) + 1,
//             isolationAtHome: Math.floor(Math.random() * 3000) + 1,
//             criticalPatients: Math.floor(Math.random() * 300) + 1,
//             ventilatedPatients: Math.floor(Math.random() * 200) + 1,
//             severePatients: Math.floor(Math.random() * 1000) + 1,
//             totalDeaths: Math.floor(1000 / i) + 1000,
//             vaccinatedFirst: Math.floor(Math.random() * 22400) + 1000,
//             vaccinatedSecond: Math.floor(Math.random() * 32244) + 1000,
//             numberOfTests: Math.floor(Math.random() * 50000) + 1000,
//             newVerified: Math.floor(Math.random() * 1542) + 10
//         }
//         const newDayStats = new DailyStatics(newDayStatsData)
//         await newDayStats.save();
//     }
// }
// createDailyStatsData()

// crateCitiesData = async () => {
//     for (let i = 4; i >= 0; i--) {
//         const today = new Date();
//         today.setDate(today.getDate() - i)
//         const todayDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
//         const cityData = {
//             date: todayDate,
//             city: "ירושלים",
//             numberOfResidents: 136817,
//             currentActivePatients: Math.floor(Math.random() * 1800) + 160,
//             numberOfTests: Math.floor(Math.random() * 6700) + 200,
//             numberOfPositiveTests: Math.floor(Math.random() * 500),
//             governmentScore: "red",
//             dailyScore: Math.floor(Math.random() * 8) + 2
//         }
//         const newDayCityStats = new CityDailyStats(cityData)
//         await newDayCityStats.save();
//     }
// }
// crateCitiesData()

module.exports = { updateDailyStats }