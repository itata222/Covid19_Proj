const express = require('express')
const authAdminMiddleWare = require('../middlewares/authAdmin');
const { updateDailyStats } = require('../utils/updateDailyStats')
const DailyStatics = require('../models/DailyStaticsModel');
const Person = require('../models/PersonModel');
const Admin = require('../models/AdminModel');

const router = new express.Router();

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

router.post('/Covid19-site/Admin/logout-admin', authAdminMiddleWare, async (req, res) => {
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

router.post('/Covid19-site/Admin/createPatient', async (req, res) => {
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


module.exports = router;