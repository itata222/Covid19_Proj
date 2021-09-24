const mongoose = require('mongoose')

const dailyStaticsScheme = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true
        },
        newVerified: {
            type: Number
        },
        activePatients: {
            type: Number,
            required: true,
            min: 0
        },
        isolationAtHotels: {
            type: Number,
            required: true,
            min: 0
        },
        isolationAtHospitals: {
            type: Number,
            required: true,
            min: 0
        },
        isolationAtHome: {
            type: Number,
            required: true,
            min: 0
        },
        severePatients: {
            type: Number,
            required: true,
        },
        criticalPatients: {
            type: Number,
        },
        ventilatedPatients: {
            type: Number,
            min: 0
        },
        vaccinatedFirst: {
            type: Number,
            min: 0
        },
        vaccinatedSecond: {
            type: Number,
            min: 0
        },
        totalDeaths: {
            type: Number
        },
        numberOfTests: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

dailyStaticsScheme.methods.updateDailyStats = async function () {
    const dailyStats = this;


    await dailyStats.save();
    return dailyStats;
};

const DailyStatics = mongoose.model("Daily-Static", dailyStaticsScheme);

module.exports = DailyStatics;