const mongoose = require("mongoose");
const validator = require("validator");

const personScheme = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            minLength: 5,
            trim: true,
            unique: [true, 'ID must be unique']
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        phone: {
            type: String,
            minLength: 5,
            required: [true, "Phone is required"],
            trim: true
        },
        condition: {
            type: String,
            required: true,
            minLength: 5,
            //Healthy,Light,Medium,Severe,Critical,Ventilated
        },
        qurantinedAt: {
            type: String,
            default: "Home"
        },
        vaccinated: {
            type: Number,
            required: true,
            min: 0,
            max: 2
            //0-None,1-Once,2-Twice
        },
        city: {
            type: String,
            required: true,
            minLength: 1,
        }
    },
    {
        timestamps: true,
    }
);



personScheme.statics.findadminbyID = async (id) => {
    const person = await Person.findOne({ id });
    if (!person) {
        throw new Error("unable to find person");
    }

    return person;
};



const Person = mongoose.model("Persons", personScheme);

module.exports = Person;