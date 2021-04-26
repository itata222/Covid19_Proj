const express = require('express')
const auth = require('../middlewares/authAdmin');
const { updateDailyStats } = require('../utils/updateDailyStats')
const DailyStatics = require('../models/DailyStaticsModel');
const Person = require('../models/PersonModel');
const Admin = require('../models/AdminModel');
const CityDailyStats = require('../models/CityDailyStatsModel');

const router = new express.Router();


router.post('/Covid19-site/Admin/create-admin', async (req, res) => {
    try {
        const admin = new Admin(req.body)
        if (!admin) {
            res.status(400).send({
                status: 400,
                message: 'bad request'
            })
        }
        await admin.save()
        res.send(admin)
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: err.message
        })
    }
})

router.post('/Covid19-site/Admin/login-admin', async (req, res) => {
    try {
        const admin = await Admin.findadminbyEmailAndPassword(req.body.email, req.body.password)
        const currentToken = await admin.generateAuthToken();
        res.send({ admin, currentToken })
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: err.message
        })
    }
})

router.post('/Covid19-site/Admin/logout-admin', auth, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((tokenDoc) => tokenDoc.token !== req.token)
        await req.admin.save()
        res.send(req.admin)
    } catch (err) {
        res.status(500).send({
            status: 500,
            message: 'something went wrong'
        })
    }
})

router.post('/Covid19-site/Admin/createPatient', auth, async (req, res) => {
    try {
        const today = new Date();
        const todayDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
        const newPatient = new Person(req.body);
        const todayStatics = await DailyStatics.findOne({ date: todayDate })
        if (!todayStatics)
            res.status(404).send('date not found')
        updateDailyStats(newPatient, todayStatics)
        // console.log('todayStats: ', todayStatics)
        // console.log('patient: ', newPatient)
        await todayStatics.save();
        await newPatient.save();
        res.send({ newPatient, todayStatics });
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/Covid19-site/Admin/getAllPersons', auth, async (req, res) => {
    try {
        const persons = await Person.find({})
        if (!persons)
            res.status(404).send({
                status: 404,
                message: 'lack of information'
            })
        res.send(persons)
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: e.message
        })
    }
})

router.patch('/Covid19-site/Admin/updatePersonData', auth, async (req, res) => {
    const id = req.query.id;
    const availableEdits = ['city', 'phone', 'condition', 'quarantinedAt', 'vaccinated']
    for (let key in req.body) {
        if (!availableEdits.includes(key))
            return res.status(404).send({
                status: 404,
                message: 'didnt entered valid key to edit a person' + key
            })
    }
    try {
        console.log(id)
        const person = await Person.findOneAndUpdate({ id }, req.body, {
            new: true,
            runValidators: true
        })
        if (!person)
            return res.status(404).send('Person not found')
        console.log(person)
        await person.save()
        res.send(person)
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: e.message
        })
    }
})

router.patch('/Covid19-site/Admin/updateCityData', auth, async (req, res) => {
    const city = req.query.city;
    const today = new Date();
    const todayDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
    const availableEdits = ['date', 'numberOfResidents', 'currentActivePatients', 'numberOfTests', 'numberOfPositiveTests', 'governmentScore', 'dailyScore']
    for (let key in req.body) {
        if (!availableEdits.includes(key))
            return res.status(404).send({
                status: 404,
                message: 'didnt entered valid key to edit a person' + key
            })
    }
    try {
        const cityUpdate = await CityDailyStats.findOneAndUpdate({ city, date: todayDate }, req.body, {
            new: true,
            runValidators: true
        })

        if (!cityUpdate)
            return res.status(404).send('Person not found')

        console.log(cityUpdate)
        await cityUpdate.save()
        res.send(cityUpdate)
    } catch (e) {
        res.status(500).send({
            status: 500,
            message: e.message
        })
    }
})

router.post('/Covid19-site/Admin/createPerson', auth, async (req, res) => {
    try {
        const person = new Person(req.body)
        if (!person)
            return res.status(400).send({
                status: 400,
                message: 'bad request'
            })
        console.log('3', person)
        let newPerson = await person.save();
        console.log('4', newPerson)
        res.send(person)
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})


module.exports = router;