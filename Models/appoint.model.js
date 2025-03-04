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
        vaidate: [validator.isEmail, "Please enter a valid Email "],
    },
    AppointDate: {type: Date, required: true},
    AppointTime: {type: String, required: true},
});

const Appoint = mongoose.model("Appointment", appointSchema);

export default Appoint;