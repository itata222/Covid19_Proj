const schedule = require('node-schedule');
const DailyStatics = require('../models/DailyStaticsModel')

const updateDailyStats = (patient, todayStats) => {
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

// const createData = async () => {
//     for (let i = 60; i > 0; i--) {
//         const today = new Date();
//         today.setDate(today.getDate() - i)
//         const todayDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
//         const newDayStatsData = {
//             date: todayDate,
//             activePatients: Math.floor(i * 80) + 1,
//             isolationAtHotels: Math.floor(i * 7) + 1,
//             isolationAtHospitals: Math.floor(i * 3) + 1,
//             isolationAtHome: Math.floor(i * 70) + 1,
//             criticalPatients: Math.floor(i * 2) + 1,
//             ventilatedPatients: Math.floor(i * 1.5) + 1,
//             severePatients: Math.floor(i * 4) + 1,
//             totalDeaths: Math.floor(i / 10 * 40) + 1,
//             vaccinatedFirst: Math.floor(i / 10 * 5000) + 1,
//             vaccinatedSecond: Math.floor(i / 10 * 4000) + 1,
//             numberOfTests: Math.floor(Math.random() * 40000) + 1000,
//             newVerified: Math.floor(i / 10 * 1000) + 1
//         }
//         const newDayStats = new DailyStatics(newDayStatsData)
//         await newDayStats.save();
//     }
// }
// createData()

module.exports = { updateDailyStats }