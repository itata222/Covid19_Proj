const express = require('express');
const CityDailyStats = require('../models/CityDailyStatsModel');
const DailyStatics = require('../models/DailyStaticsModel');
const Person = require('../models/PersonModel');

const router = new express.Router();

router.get('/Covid19-site/GetDailyStatics', async (req, res) => {
    try {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const todayDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
        const yesterdayDate = `${yesterday.getDate()}.${yesterday.getMonth() + 1}.${yesterday.getFullYear()}`;
        const todayData = await DailyStatics.findOne({ date: todayDate })
        const yesterdayData = await DailyStatics.findOne({ date: yesterdayDate })
        const allTimeData = await DailyStatics.find({})
        const personsMidnight = await Person.find({ $or: [{ createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()) } }, { updatedAt: { $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()) } }] })
        let alltimeVaccinatedFirst = 0, alltimeVaccinatedSecond = 0, allTimeSumVerified = 0;;

        allTimeData.forEach(dailyStats => {
            allTimeSumVerified += dailyStats.newVerified;
            alltimeVaccinatedFirst += dailyStats.vaccinatedFirst;
            alltimeVaccinatedSecond += dailyStats.vaccinatedSecond;
        });

        res.send({ todayData, yesterdayData, allTimeSumVerified, alltimeVaccinatedFirst, alltimeVaccinatedSecond, personsMidnight })
    } catch {
        res.status(500).send({
            status: 500,
            message: 'Internal error'
        })
    }
})

router.get('/Covid19-site/GetDataPeriodOf', async (req, res) => {
    const timeframe = parseInt(req.query.timeframe);
    let arrayOfData = [];
    try {
        if (timeframe !== -1)
            for (let i = timeframe; i > 0; i--) {
                const today = new Date();
                today.setDate(today.getDate() - i);
                currentDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
                const dayData = await DailyStatics.findOne({ date: currentDate })
                arrayOfData.push(dayData)
            }
        else
            arrayOfData = await DailyStatics.find({})
        res.send(arrayOfData)
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: e.message
        })
    }
})

router.post('/Covid19-site/createCityData', async (req, res) => {
    try {
        const city = new CityStatics(req.body)
        if (!city)
            res.status(400).send({
                status: 400,
                message: 'bad request'
            })
        city.newVerifiedFor10K = city.numberOfPositiveTests / city.numberOfResidents * 10000
        city.percentagePositive = city.numberOfTests / city.numberOfPositiveTests
        city.changeVerified = city.currentActivePatients /
            await city.save()
        res.send(city)
    } catch (e) {
        res.status(500).send({
            status: 400,
            message: e
        })
    }
})
router.get('/Covid19-site/getDayDataCities', async (req, res) => {
    try {
        const today = new Date();
        const weekago = new Date();
        weekago.setDate(weekago.getDate() - 7);
        const todayDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
        const weekagoDate = `${weekago.getDate()}.${weekago.getMonth() + 1}.${weekago.getFullYear()}`;
        const citiesToday = await CityDailyStats.find({ date: todayDate })
        const citiesWeekAgo = await CityDailyStats.find({ date: weekagoDate })
        res.send({ citiesToday, citiesWeekAgo })
    } catch (e) {
        res.status(500).send({
            status: 400,
            message: e
        })
    }
})




module.exports = router