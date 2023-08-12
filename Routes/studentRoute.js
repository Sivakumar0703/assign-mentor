
const studentRoute = require("express").Router();
const studentModal = require("../Schema/studentSchema");
const mentorModel = require("../Schema/mentorSchema");


// get student data
studentRoute.get("/", async (req, res) => {
    try {
        let student = await studentModal.find();
        res.status(200).json({ student, message: "student list" })
    } catch (error) {
        res.send({ message: "unable to get student data", error })
    }
})


// create new student data 
studentRoute.post("/register", async (req, res) => {

    try {
        const student = await studentModal.findOne({ email: req.body.email })

        if (!student) {

            studentModal.create(req.body)
                .then(resolve => res.status(200).json({ message: "Registration successful" }))
                .catch((error) => {
                    res.status(400).json({ message: "Invalid Email" })
                });

        } else {
            res.send({ message: "User already exists" })
        }

    } catch (error) {
        res.send({ message: "Registration failed", error })
    }
})



// assign or change mentor for particular student
studentRoute.patch("/assign/mentor/:id", async (req, res) => {

    const student = await studentModal.find({ _id: req.params.id });
    const studentName = student[0].name;
    const currentMentor = req.body.currentMentor;
    const mentorsData = await mentorModel.find();
    const registeredMentor = [];
    let condition = true;


    // storing mentors name
    mentorsData.map((data) => {
        registeredMentor.push(data.name)
    })



    //  preventing unregistered mentor from assigning student
    if (!registeredMentor.includes(currentMentor)) {
        condition = false;
        return res.status(409).json({ message: `${currentMentor} is not a mentor` })
    }

    try {
        const mentorDetail = await mentorModel.findOne({ name: currentMentor })
        const studentsList = mentorDetail.assignedStudent;

        if (studentsList.includes(studentName)) {
            return res.status(400).json({ message: `${studentName} is already added as ${currentMentor}'s student` })
        }

        await mentorModel.findOneAndUpdate({ name: currentMentor }, { assignedStudent: [...studentsList, studentName] }, { new: true });
        await studentModal.findOneAndUpdate({ _id: req.params.id }, { currentMentor: currentMentor }, { new: true })
        res.status(200).json({ message: `${currentMentor} has been assigned as the mentor for ${studentName}` })
    } catch (error) {
        res.status(400).json({ message: "Error has been occured in assiging mentor" })
    }

})



//  change mentor for particular student
studentRoute.patch("/change/mentor/:id", async (req, res) => {

    const student = await studentModal.find({ _id: req.params.id });
    const previousMentor = student[0].currentMentor;

    const currentMentor = req.body.currentMentor

    if (currentMentor === "N/A") { // no previous mentor - assign mentor
        await studentModal.findOneAndUpdate({ _id: req.params.id }, { currentMentor: currentMentor }, { new: true })
        res.status(200).json({ message: `${currentMentor} has been assigned as the mentor for ${student[0].name}` })
    } else { // change mentor
        await studentModal.findOneAndUpdate({ _id: req.params.id }, { currentMentor: currentMentor, previousMentor: previousMentor }, { new: true })
        res.status(200).json({ message: `${currentMentor} has been assigned as the new mentor for ${student[0].name}` })
    }

})



// previously assigned mentor name list
studentRoute.get("/:id", async (req, res) => {
    const student = await studentModal.findById(req.params.id);

    if (student) {
        const previousMentor = student.previousMentor;
        res.status(200).json({ message: `${student.name}'s previous mentor was ${previousMentor}` })
    } else {
        res.status(400).json({ message: "Error in fetching data of previous mentor" })
    }

})




module.exports = studentRoute;