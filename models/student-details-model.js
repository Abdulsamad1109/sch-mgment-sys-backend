const {Schema,model} = require("mongoose")


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

module.exports = Student_details