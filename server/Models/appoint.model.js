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
    Reason: {type: String, required: true},
    DocEmail: {type: String, required: true},
    AppointDate: {type: Date, required: true},    
    AppointTime: {type: String, required: true},
    zoomMeetingLink: {type: String},
    zoomMeetingId: {type: String},
    zoomPassword: {type: String},
    document:{
        data: Buffer,
        contentType: String,
        filename: { type: String, required: true }, 
    },

});

const Appoint = mongoose.model("Appointment", appointSchema);

export default Appoint;