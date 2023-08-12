
const mongoose = require("mongoose");
const validator = require("validator");


const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true,
        min: 3
    },

    email: {
        type: String,
        require: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },

    currentMentor: {
        type: String,
        default:"N/A"
    },

    previousMentor:{
        type:String,
        default:"None"
    }

})

module.exports = mongoose.model("students", studentSchema);