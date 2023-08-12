const express = require("express");
const app = express();
const mongoose = require("mongoose");

const studentRoute = require("./Routes/studentRoute");
const mentorRoute = require("./Routes/mentorRoute");

// routes
app.use(express.json()); // to read the body.json(input value) otherwise it show undefined
app.use("/student" , studentRoute);
app.use("/mentor" , mentorRoute);

// port number
const port = 8000;

// database configuration
mongoose.connect(`mongodb+srv://SivaKumar:siVaAtlas@sivakumar.yhfef3z.mongodb.net/node3`);


app.get('/' , function(req,res){
    try {
        res.status(200).json({message:'NODE DAY 3 TASK'});
    } catch (error) {
        res.status(400).json({message:'error in starting express'}); 
    }
})

app.listen(port , ()=> console.log('server online'));







