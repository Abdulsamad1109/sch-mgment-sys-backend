const {Schema,model} = require("mongoose")



const staff_detailsSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true
    },
    password: String,
})

const Staff_detailsSchema = model("staff_detail", staff_detailsSchema)

module.exports = Staff_detailsSchema