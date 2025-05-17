const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt");
const Student_details = require("../models/student-details-model")
const jwt = require("jsonwebtoken");
// const {generateToken1, generateToken2} = require("../Jwt");
const jwtSecret = process.env.JWT_SECRET;



router.post("/studentRegForm", async (req,res)=>{
    let radm = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    let rnd = Math.round(radm);
    let toNum = String(rnd);


    let salt = await bcrypt.genSalt(10);
    let {password} = req.body;
    try {
        let hashedPassword = await bcrypt.hash(password, salt)
        
        let {firstName, lastName, email} = req.body
        let stu_details_to_DB = Student_details({firstName, lastName, email, password: hashedPassword, matricNum: toNum})
        stu_details_to_DB.save();
        res.send("registration successful");
    } catch (error) {
        console.log("registration failed", error);
        
    }
})




router.post("/studentLogin", async (req, res) => {
    try {
        let { loginmatricNum, loginPassword } = req.body;
        let findUser = await Student_details.findOne({matricNum: loginmatricNum});
        
        if (findUser) {
            let hiddenPassword = await bcrypt.compare(loginPassword, findUser.password);
            if (hiddenPassword) {
                let { password, ...rest } = findUser;
                let jwtToken1 = jwt.sign({...rest, role:"student"}, jwtSecret, { expiresIn: "1d" });
                if (jwtToken1) {
                    res.send({jwtToken1, firstName: findUser.firstName, lastName: findUser.lastName})
                }else{
                    // res.send("incorrect email or password ")
                }
            } else {
                res.send("incorrect password");
            }
        } else {
            res.send("incorrect matric number");
        }
    } catch (error) {
        return res.send("internal server error", error)
    }
});




module.exports = router
