require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const {connect} = require("mongoose");
const student_details_router = require("./controllers/student-details-controller")
const staff_details_router = require("./controllers/staff-details-controller")
const uri = process.env.URI;
const crypto = require('crypto')

const app = express();

app.use(cors());
app.use(express.urlencoded(true));
app.use(express.json());


connect(uri).then(res=>{
    console.log("connection succesfull");
})
.catch(err=>{
    console.log("connection failed");
})


app.use("/student_details", student_details_router)
app.use("/staff_details", staff_details_router)






app.get("/", (req,res)=>{
    res.send("hello");
});





app.get("/get_all", async(req,res)=>{
    try {
        let allStudents = await Student_details.find({})
        console.log(allStudents);
        res.json(allStudents)
    } catch (error) {
        res.send("error getting all")
    }
    })




// app.post("/editName", (req,res)=>{
//     let {firstName} = req.body;  
//     Student_details.findOneAndUpdate({matricNum: 252455}, {firstName}).then(student_detail=>{
//         console.log(student_detail);
//     }).then(err=>{
//         res.send(err)
//     })
// })




app.get("/profile", (req,res)=>{
    let {authorization} =  req.headers
    let newAuto = (authorization.split(" "))[1]
    if (!authorization) return res.send("invalid request")
    jwt.verify(newAuto, jwtSecret, (err, user)=>{
        console.log(user, "hello sir")
        if(err) return res.send("something went wrong")
           return res.json(user)
    })
})



app.listen("5000", ()=>{
    console.log("App is running");
});