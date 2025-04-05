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
    AppointDate: {type: Date, required: true},
    AppointTime: {type: String, required: true},
    Status: {
        type: String, 
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    // Zoom meeting details
    zoomMeetingId: {type: String},
    zoomMeetingUrl: {type: String},
    zoomMeetingPassword: {type: String},
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Appoint = mongoose.model("Appointment", appointSchema);

export default Appoint;