const express = require('express')
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
        let allTimeSumVerified = 0;
        let alltimeVaccinatedFirst = 0, alltimeVaccinatedSecond = 0;
        allTimeData.forEach(dailyStats => {
            allTimeSumVerified += dailyStats.newVerified;
            alltimeVaccinatedFirst += dailyStats.vaccinatedFirst;
            alltimeVaccinatedSecond += dailyStats.vaccinatedSecond;
        });
        const personsMidnight = await Person.find({ createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()) } })
        if (!todayData)
            return res.status(404).send({
                status: 404,
                message: 'Data not found'
            })
        res.send({ todayData, yesterdayData, personsMidnight, allTimeSumVerified, alltimeVaccinatedFirst, alltimeVaccinatedSecond })
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
                // console.log(i, ':', today)
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





module.exports = router