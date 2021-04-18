const mongoose = require("mongoose");
const validator = require("validator");

const personScheme = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            trim: true,
            unique: [true, 'ID must be unique']
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: false,
            trim: true,
            lowercase: true,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid Email");
                }
            },
        },
        phone: {
            type: String,
            required: [true, "Phone is required"],
            trim: true
        },
        condition: {
            type: String,
            required: true,
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