import mongoose from "mongoose";
import validator from "validator";

const add_docSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        validate: [validator.isEmail, "Please enter a valid Email"],
    },
    specialization:{
        type: String,
        required: true
    },
    experience:{
        type: Number,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ["active", "inactive"],
        required: true
    },
});

const Add_doc = mongoose.model("Add_doc", add_docSchema);

export default Add_doc;