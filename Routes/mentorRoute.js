const mentorRoute = require("express").Router();
const mentorModel = require("../Schema/mentorSchema");
const studentModal = require("../Schema/studentSchema");

// get every mentor data
mentorRoute.get("/", async (req, res) => {
    const mentors = await mentorModel.find();
    try {
        res.status(200).json({ message: "Mentor data list" , mentors})
    } catch (error) {
        res.status(400).json({ message: "Data fetching failed" })
    }
})

// Register mentor
mentorRoute.post("/register", async (req, res) => {

    try {
        const mentor = await mentorModel.findOne({ email: req.body.email })

        if (!mentor) {

            mentorModel.create(req.body)
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

// get all students who are assigned to the particular mentor
mentorRoute.get("/:id", async (req, res) => {
    const mentor = await mentorModel.findById(req.params.id);

    if (mentor) {
        const studentList = mentor.assignedStudent;
        res.status(200).json({ message: `Mr.${mentor.name}'s students name list`, studentList })
    } else {
        res.status(400).json({ message: "Data fetching failed" })
    }

})

// assign many student to single mentor
mentorRoute.patch("/assign/student/:id", async (req, res) => {

    const mentor = await mentorModel.find({ _id: req.params.id });
    const students = req.body.studentList;
    let studentsData = await studentModal.find();
    let registerdStudent = [];
    let condition = true;

    // Name list of Registered srudents
    studentsData.map((std) => {
        registerdStudent.push(std.name)
    })

    //  preventing unregistered student from assigning mentor
    students.forEach((name) => {
        if (!registerdStudent.includes(name)) {
            condition = false;
            return res.status(401).json({ message: `${name} is not a registered student` })
        }
    })


    let studentList = [];
    let studentsId = []; // contain student id

    try {
        if (condition) {

            students.forEach((studentName) => { // from request

                studentsData.map((data) => { // from data base
                    if ((data.name === studentName) && (data.currentMentor === "N/A")) {
                        studentList.push(data.name)
                        studentsId.push(data._id)
                    }
                })

            })


            // updating student's mentor in database
            studentsId.forEach((id) => { 

                studentsData.map(async (data) => { 
                    if (data._id === id) {
                        await studentModal.findOneAndUpdate({ _id: id }, { currentMentor: mentor[0].name }, { new: true })
                    }
                })

            })
            await mentorModel.findOneAndUpdate({ _id: req.params.id }, { assignedStudent: studentList }, { new: true })
            return res.status(200).json({ message: `Mr.${mentor[0].name}'s students are ${studentList}` })
        }
    } catch (error) {
        res.status(400).json({ message: "Error has been occured in assiging students" })
    }

})


module.exports = mentorRoute;