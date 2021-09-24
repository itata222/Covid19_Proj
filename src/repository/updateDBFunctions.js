const schedule = require('node-schedule');
const CityDailyStats = require('../models/CityDailyStatsModel');
const DailyStatics = require('../models/DailyStaticsModel')

const today = new Date();
const todayDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;

const updateCityAndDailyDataWhenCreatingAPerson = async (person, todayData) => {
    const cityOfThePerson = await CityDailyStats.findOne({ city: person.city, date: todayDate });

    let cityNewData = {}, dailyNewData = {};
    person.condition = person.condition.trim();

    if (cityOfThePerson) cityNewData.numberOfResidents = cityOfThePerson.numberOfResidents + 1;
    if (person.condition !== 'healthy') {
        if (cityOfThePerson) cityNewData.currentActivePatients = cityOfThePerson.currentActivePatients + 1;
        dailyNewData.activePatients = todayData.activePatients + 1;
        dailyNewData.newVerified = todayData.newVerified + 1;
    }

    switch (person.vaccinated) {
        case 1:
            dailyNewData.vaccinatedFirst = todayData.vaccinatedFirst + 1;
            dailyNewData.numberOfTests = todayData.numberOfTests + 1;
            break;
        case 2:
            dailyNewData.vaccinatedSecond = todayData.vaccinatedSecond + 1;
            dailyNewData.numberOfTests = todayData.numberOfTests + 1;
            break;
    }
    switch (person.condition) {
        case 'severe':
            dailyNewData.severePatients = todayData.severePatients + 1;
            break;
        case 'critical':
            dailyNewData.criticalPatients = todayData.criticalPatients + 1;
            break;
        case 'ventilated':
            dailyNewData.ventilatedPatients = todayData.ventilatedPatients + 1;
            break;
    }
    switch (person.qurantinedAt) {
        case 'home':
        case 'Home':
            dailyNewData.isolationAtHome = todayData.isolationAtHome + 1;
            break;
        case 'hospital':
            dailyNewData.isolationAtHospitals = todayData.isolationAtHospitals + 1;
            break;
        case 'hotel':
            dailyNewData.isolationAtHotels = todayData.isolationAtHotels + 1;
            break;
    }
    if (cityOfThePerson) {
        const cityOfThePersonUpdated = await CityDailyStats.findOneAndUpdate({ city: person.city, date: todayDate }, cityNewData, {
            new: true,
            runValidators: true
        });
        await cityOfThePersonUpdated.save();
    }
    const dailyNewDataUpdated = await DailyStatics.findOneAndUpdate({ date: todayDate }, dailyNewData, {
        new: true,
        runValidators: true
    });
    await dailyNewDataUpdated.save();
}

const updateCityAndDailyDataWhenUpdatingAPerson = async (personBefore, personAfter) => {
    const todayDataFromDB = await DailyStatics.findOne({ date: todayDate })
    const leftedCityData = await CityDailyStats.findOne({ city: personBefore.city, date: todayDate })
    const joinedCityData = await CityDailyStats.findOne({ city: personAfter.city, date: todayDate })

    let dataForLeftedCity = {}, dataForJoinedCity = {};
    let todayNewData = {};

    personBefore.condition = personBefore.condition.trim()
    personAfter.condition = personAfter.condition.trim()

    if (personBefore.city !== personAfter.city) {
        if (personBefore.condition !== 'healthy')
            dataForLeftedCity = {
                numberOfResidents: leftedCityData.numberOfResidents - 1,
                currentActivePatients: leftedCityData.currentActivePatients - 1
            }
        else
            dataForLeftedCity = {
                numberOfResidents: leftedCityData.numberOfResidents - 1
            }
        if (joinedCityData && personAfter.condition !== 'healthy')
            dataForJoinedCity = {
                numberOfResidents: joinedCityData.numberOfResidents + 1,
                currentActivePatients: joinedCityData.currentActivePatients + 1
            }
        else if (joinedCityData)
            dataForJoinedCity = {
                numberOfResidents: joinedCityData.numberOfResidents + 1
            }

        const leftedCity = await CityDailyStats.findOneAndUpdate({ city: personBefore.city, date: todayDate }, dataForLeftedCity, {
            new: true,
            runValidators: true
        })
        await leftedCity.save();
        const joinedCity = await CityDailyStats.findOneAndUpdate({ city: personAfter.city, date: todayDate }, dataForJoinedCity, {
            new: true,
            runValidators: true
        })
        await joinedCity.save();

    }
    if (personBefore.condition !== personAfter.condition) {
        if (personBefore.condition === 'healthy') {
            todayNewData = {
                newVerified: todayDataFromDB.newVerified + 1,
                activePatients: todayDataFromDB.activePatients + 1
            }
            if (personAfter.condition === 'severe') todayNewData.severePatients = todayDataFromDB.severePatients + 1;
            else if (personAfter.condition === 'critical') todayNewData.criticalPatients = todayDataFromDB.criticalPatients + 1;
            else if (personAfter.condition === 'ventilated') todayNewData.ventilatedPatients = todayDataFromDB.ventilatedPatients + 1;
            if (personAfter.qurantinedAt === 'home') todayNewData.isolationAtHome = todayDataFromDB.isolationAtHome + 1;
            else if (personAfter.qurantinedAt === 'hotel') todayNewData.isolationAtHotels = todayDataFromDB.isolationAtHotels + 1;
            else if (personAfter.qurantinedAt === 'hospital') todayNewData.isolationAtHospitals = todayDataFromDB.isolationAtHospitals + 1;
        }
        else if (personAfter.condition === 'healthy') {
            todayNewData = {
                newVerified: todayDataFromDB.newVerified - 1,
                activePatients: todayDataFromDB.activePatients - 1
            }
            if (personBefore.condition === 'severe') todayNewData.severePatients = todayDataFromDB.severePatients - 1;
            else if (personBefore.condition === 'critical') todayNewData.criticalPatients = todayDataFromDB.criticalPatients - 1;
            else if (personBefore.condition === 'ventilated') todayNewData.ventilatedPatients = todayDataFromDB.ventilatedPatients - 1;
            if (personBefore.qurantinedAt === 'home') todayNewData.isolationAtHome = todayDataFromDB.isolationAtHome - 1;
            else if (personBefore.qurantinedAt === 'hotel') todayNewData.isolationAtHotels = todayDataFromDB.isolationAtHotels - 1;
            else if (personBefore.qurantinedAt === 'hospital') todayNewData.isolationAtHospitals = todayDataFromDB.isolationAtHospitals - 1;
        }
        else if (personAfter.condition === 'ventilated') {
            todayNewData.ventilatedPatients = todayDataFromDB.ventilatedPatients + 1;
        }
        else if (personAfter.condition === 'severe') todayNewData.severePatients = todayDataFromDB.severePatients + 1;
    }
    if (personBefore.qurantinedAt !== personAfter.qurantinedAt) {
        if (personAfter.qurantinedAt === 'home' && !todayNewData.isolationAtHome) todayNewData.isolationAtHome = todayDataFromDB.isolationAtHome + 1;
        else if (personAfter.qurantinedAt === 'hotel' && !todayNewData.isolationAtHotels) todayNewData.isolationAtHotels = todayDataFromDB.isolationAtHotels + 1;
        else if (personAfter.qurantinedAt === 'hospital' && !todayNewData.isolationAtHospitals) todayNewData.isolationAtHospitals = todayDataFromDB.isolationAtHospitals + 1;
    }
    if (personBefore.vaccinated !== personAfter.vaccinated) {
        if (personAfter.vaccinated === 2) todayNewData.vaccinatedSecond = todayDataFromDB.vaccinatedSecond + 1;
        else if (personAfter.vaccinated === 1) todayNewData.vaccinatedFirst = todayDataFromDB.vaccinatedFirst + 1;
    }

    const todayDailyData = await DailyStatics.findOneAndUpdate({ date: todayDate }, todayNewData)
    await todayDailyData.save();
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
//     const today = new Date();
//     today.setDate(today.getDate() - i)
//     const todayDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
//     const newDayStatsData = {
//         date: todayDate,
//         activePatients: Math.floor(Math.random() * 5000) + 1,
//         isolationAtHotels: Math.floor(Math.random() * 500) + 1,
//         isolationAtHospitals: Math.floor(Math.random() * 100) + 1,
//         isolationAtHome: Math.floor(Math.random() * 3000) + 1,
//         criticalPatients: Math.floor(Math.random() * 300) + 1,
//         ventilatedPatients: Math.floor(Math.random() * 200) + 1,
//         severePatients: Math.floor(Math.random() * 1000) + 1,
//         totalDeaths: Math.floor(1000 / 2) + 1000,
//         vaccinatedFirst: Math.floor(Math.random() * 22400) + 1000,
//         vaccinatedSecond: Math.floor(Math.random() * 32244) + 1000,
//         numberOfTests: Math.floor(Math.random() * 50000) + 1000,
//         newVerified: Math.floor(Math.random() * 1542) + 10
//     }
//     const newDayStats = new DailyStatics(newDayStatsData)
//     await newDayStats.save();
//     }
// }
// createDailyStatsData()

// crateCitiesData = async () => {
//         const cities = ['תל אביב', "ירושלים", "ראשון לציון", "חולון", "אילת", "רחובות", "פרדס חנה", "בנימינה", "כפר סבא", "נהריה"]
//         const residents = [107938, 129394, 87492, 21423, 9029, 14020, 3029, 3490, 8029, 10203];
//     for (let i = cities.length - 1; i >= 0; i--) {
//         for (let j = 7; j >= 0; j--) {
//             const today = new Date();
//             today.setDate(today.getDate() - j)
//             const todayDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
//             const cityData = {
//                 date: todayDate,
//                 city: cities[i],
//                 numberOfResidents: residents[i],
//                 currentActivePatients: Math.floor(Math.random() * 1800) + 160,
//                 numberOfTests: Math.floor(Math.random() * 6700) + 200,
//                 numberOfPositiveTests: Math.floor(Math.random() * 500),
//                 governmentScore: "orange",
//                 dailyScore: Math.floor(Math.random() * 8) + 2
//             }

//             const newDayCityStats = new CityDailyStats(cityData)
//             await newDayCityStats.save();
//         }
//     }
// }
// crateCitiesData()



module.exports = { updateCityAndDailyDataWhenCreatingAPerson, updateCityAndDailyDataWhenUpdatingAPerson }