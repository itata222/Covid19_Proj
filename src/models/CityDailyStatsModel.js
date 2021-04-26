const mongoose = require('mongoose')

const CityStatsScheme = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
            trim: true,
            unique: false
        },
        numberOfResidents: {
            type: Number,
            required: true
        },
        currentActivePatients: {
            type: Number,
            required: true
        },
        numberOfTests: {
            type: Number,
            required: true,
            min: 0
        },
        numberOfPositiveTests: {
            type: Number,
            required: true,
            min: 0
        },
        governmentScore: {
            type: String,
            required: true,
            lowercase: true,
        },
        dailyScore: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)


const CityDailyStats = mongoose.model("CityDailyStats", CityStatsScheme);

module.exports = CityDailyStats;