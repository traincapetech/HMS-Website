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
    DOB: {type: Date},
    Gender: {type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    CountryCode: {type: String,
        default: 'US',
    },
    Country: {type: String, required: true},
    City: {type: String, required: true},
    State: {type: String, required: true}, 
    Expertise: {type: String},
    Speciality: {type: String, required: true},
    Experience: {type: String, required: true},
    Hospital: {type: String},
    ConsultType: {type: String,
        enum: ['Video', 'InClinic', 'Both'],
    },
    Fees: {type: Number},
    Address: {type: String},
    LicenseNo: {type: String, required: true},
    Education: {type: String, required: true},
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