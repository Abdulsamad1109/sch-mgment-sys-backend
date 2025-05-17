const express = require("express");
const router = express.Router()
const bcrypt = require("bcrypt");
const Staff_details = require("../models/staff-details-model")
const jwt = require("jsonwebtoken")
const jwtSecret = process.env.JWT_SECRET;


router.post("/staffRegForm", async (req,res)=>{
    
    try {
        let {firstName, lastName, email, password} = req.body
        

        let salt = await bcrypt.genSalt(10);
        let hashedpassword = await bcrypt.hash(password, salt)
        let staff_details_To_DB = Staff_details({firstName, lastName, email, password: hashedpassword})
        staff_details_To_DB.save()
        

        res.send("registered successfuly")
    } catch (error) {
        console.log("registration error", error);
        
    }
})


router.post("/staffLogin", async (req,res)=>{
    try {
        let {loginEmail, loginPassword} = req.body
    
        let findStaff = await Staff_details.findOne({email: loginEmail})

        if (findStaff){
            let hiddenPassword = await bcrypt.compare(loginPassword, findStaff.password)
            if (hiddenPassword){
                let {password, ...rest} = findStaff
                let jwtToken2 = jwt.sign({...rest, role:2}, jwtSecret, {expiresIn: "1d"})
                if (jwtToken2) {
                    res.send({jwtToken2, firstName: findStaff.firstName, lastName: findStaff.lastName})
                }else{

                }
                
            }else {
                res.send("incorrect password");
            }
        }else {
            res.send("incorrect email");
        }
    } catch (error) {
        return res.send("internal server error", error)
    }
})

module.exports = router
