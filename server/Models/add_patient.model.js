import mongoose from "mongoose";
import validator from "validator";

const add_patientSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        validate: [validator.isEmail, "Please enter a valid Email"],    
    },
    phone:{
        type: Number,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    dateofBirth:{
        type: Date,
        required: true
    },
    gender:{
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    bloodGroup:{
        type: String,
        required: true
    },
    medicalHistory:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    specialization:{
        type: String,
        required: true
    },
});

const add_patient = mongoose.model("Patient", add_patientSchema);

export default add_patient;