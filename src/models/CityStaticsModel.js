const mongoose = require('mongoose')

const CityStaticsScheme = new mongoose.Schema(
    {
        city: {
            type: String,
            required: true
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
        }
    },
    {
        timestamps: true
    }
)


const CityStatics = mongoose.model("City-Static", CityStaticsScheme);

module.exports = CityStatics;