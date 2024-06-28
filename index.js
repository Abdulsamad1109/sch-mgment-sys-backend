require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {connect,model,Schema} = require("mongoose");
const jwtSecret = process.env.JWT_SECRET;
const uri = process.env.URI;

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





app.listen("5000", ()=>{
    console.log("App is running");
});

app.get("/", (req,res)=>{
    res.send("hello");
});
app.get("/contact", (req,res)=>{
    res.send("contact page");
});




const student_detailsSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true
    },
    password: String,
    matricNum: {
        type: Number,
        required: true,
        min: 6
    }
})

const Student_details = model("student_detail", student_detailsSchema) 

const studentsForm = [];
app.post("/studentRegForm", async (req,res)=>{
    let radm = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    let rnd = Math.round(radm);
    let toNum = String(rnd);


    let salt = await bcrypt.genSalt(10);
    let {password} = req.body;
    let hashedPassword = await bcrypt.hash(password, salt)
    // studentsForm.push({...req.body, password: hashedPassword, matricNum: toNum})
    res.send("successful");
    
    let {firstName, lastName, email} = req.body
    let stu_details_to_DB = Student_details({firstName, lastName, email, password: hashedPassword, matricNum: toNum})
    stu_details_to_DB.save();
})

app.get("/get_all", async(req,res)=>{
    try {
        let allStudents = await Student_details.find({})
        console.log(allStudents);
        res.json(allStudents)
    } catch (error) {
        res.send("error getting all")
    }
    })



app.post("/studentLogin", async (req, res) => {
    try {
        let { loginmatricNum, loginPassword } = req.body;
        let findUser = await Student_details.findOne({matricNum: loginmatricNum});
        // let findUser = allStudents.find(user => user.matricNum === loginmatricNum);
        
        if (findUser) {
            let hiddenPassword = await bcrypt.compare(loginPassword, findUser.password);
            if (hiddenPassword) {
                let { password, ...rest } = findUser;
                let myJwtToken = jwt.sign(rest, jwtSecret, { expiresIn: "1d" });
                res.json({ token: myJwtToken });
                console.log({ token: myJwtToken });
            } else {
                res.send("incorrect password");
            }
        } else {
            res.send("incorrect matric number");
        }
    } catch (err) {
        res.send("log in pls");
    }
});



// app.post("/editName", (req,res)=>{
//     let {firstName} = req.body;  
//     Student_details.findOneAndUpdate({matricNum: 252455}, {firstName}).then(student_detail=>{
//         console.log(student_detail);
//     }).then(err=>{
//         res.send(err)
//     })
// })




// app.post("/studentLogin", async(req,res)=>{

    // try {
    //     allStudents = await Student_details.find({})
    //     console.log(allStudents);
    //     let {loginmatricNum, loginPassword} = req.body;
    //     let findUser = allStudents.find(user=> user.matricNum === loginmatricNum);


    //     if (findUser) {
    //     let hiddenPassword = await bcrypt.compare(loginPassword, findUser.password);
    //     if (hiddenPassword) {
    //         let {password, ...rest} = findUser;
    //         let myJwtToken = jwt.sign(rest, jwtSecret, {expiresIn:"1d"});
    //         res.json({token: myJwtToken});
    //         console.log({token: myJwtToken});
    //     } else{
    //         res.send("incorrect password");
    //     }
    //     } else {
    //     return res.send("incorrect matric number") ;
    //     }
    // } catch (error) {
    //     res.send("login not succesful")
    // }
    
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



// let samad = require("crypto").randomBytes(64).toString("hex")
// console.log(samad);