//doctor.model.js
import mongoose from "mongoose";
import validator from "validator";

const doctorSchema = new mongoose.Schema({
    Name: {type: String, required: true},
    Email: {type: String,
        required: true,
        validate: [validator.isEmail, "Please enter a valid Email"],
    },
    Password:{type: String,
        required: true,
        minlength: [6, "Password should be at least 6 characters long"],
    },
    Phone: {type: Number, required: true},
    DOB: {type: Date, required: true},
    Gender: {type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'],
    },
    CountryCode: {type: String,
        required: true,
        default: 'US',
    },
    Country: {type: String, required: true},
    City: {type: String, required: true},
    State: {type: String, required: true},
    Expertise: {type: String, required: true},
    Speciality: {type: String, required: true},
    Experience: {type: String, required: true},
    Hospital: {type: String, required: true},
    ConsultType: {type: String, required: true},
    Fees: {type: Number, required: true},
    Address: {type: String, required: true},
    document: {
        data: Buffer,
        contentType: String
    },
    image: {
        data: Buffer,
        contentType: String
    },
},
{
    timestamps: true,
}
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
