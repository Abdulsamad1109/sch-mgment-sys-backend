const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;


const generateToken1 = (studentData)=>{
    const payload = {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        matricNum: studentData.matricNum,
        role: "student"
    };

    return jwt.sign(payload, jwtSecret, {expiresIn: "1d"});
};


const generateToken2 = (staffData)=>{
    const payload = {
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        email: staffData.email,
        role: "student"
    }

    return jwt.sign(payload, jwtSecret, {expiresIn: "1d"});  
};


module.exports = {
    generateToken1,
    generateToken2
};