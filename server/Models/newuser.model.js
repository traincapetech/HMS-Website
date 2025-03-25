//newuser.model.js
import mongoose from "mongoose";
import validator from "validator";

const newuserSchema = new mongoose.Schema({
    UserName: {type: String, required: true, unique: true},
    FirstName:{type: String, required: true},
    LastName: {type: String, required: true},
    Email:{
        type: String,
        required: true,
        validate: [validator.isEmail, "Please enter a valid Email"],
    },
    Phone: {type: Number, required: true},
    Password: {
        type: String,
        required: true,
        minLength: [6, "Password must be at least 6 characters"],
    },
    DOB: {type: Date, required: true},
    Gender: {type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    BloodGroup: {type: String},
    Country: {type: String, required: true},
    State: {type: String, required: true},
    City: {type: String, required: true},
    Address: {type: String, required: true},
    Pincode: {type: Number},
    ExtraPhone: {type: Number},
    Language: {type: String},
    image: {
        data: Buffer,
        contentType: String
    },
},
{
    timestamps: true,
}
);


const Newuser = mongoose.model('newuser', newuserSchema);

export default Newuser;
