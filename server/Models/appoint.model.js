//appoint.model.js
import mongoose from "mongoose";
import validator from "validator";

const appointSchema = new mongoose.Schema({

    Speciality: {type: String, required: true},
    Doctor: {type: String, required: true},
    Name: {type: String, required: true},
    Email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please enter a valid Email "],
    },
    Phone: {type: Number, required: true},
    Reason: {type: String},
    DocEmail: {type: String, required: true},
    AppointDate: {type: Date, required: true},    
    AppointTime: {type: String, required: true},
    zoomMeetingLink: {type: String},
    zoomMeetingId: {type: String},
    zoomPassword: {type: String},
    Status: {type: String,default: "Pending"},

});

const Appoint = mongoose.model("Appointment", appointSchema);

export default Appoint;