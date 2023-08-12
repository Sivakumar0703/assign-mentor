const mongoose = require("mongoose");
const validator = require("validator");


const mentorSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        validate:(value)=>{
            return validator.isEmail(value)
        }
    },

    assignedStudent:{
        type:Array,
        default:[]
    }

})



module.exports = mongoose.model("mentors" , mentorSchema);