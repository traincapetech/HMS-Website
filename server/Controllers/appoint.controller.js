//appoint.controller.js
import Appoint from "../Models/appoint.model.js";
import { validationResult } from "express-validator";
import { generateZoomMeeting } from "../zoom.service.js";

const createAppoint = async (req, res) => {
    try{
        //finding any validation error
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        //create a new appointment
        const {Speciality, Doctor, Name, Email, AppointDate, AppointTime, doctorEmail} = req.body;

        // Validate required fields for Zoom meeting
        if (!doctorEmail || !Email) {
            return res.status(400).json({ 
                message: "Doctor email and patient email are required for video consultation" 
            });
        }

        const newAppoint = new Appoint({
             Speciality, 
             Doctor, 
             Name, 
             Email, 
             AppointDate, 
             AppointTime,
             Status: "Confirmed"
        });
        
        await newAppoint.save();

        // Generate Zoom meeting with doctor and patient emails
        try {
            const zoomMeeting = await generateZoomMeeting(doctorEmail, Email);
            
            // Update appointment with Zoom meeting details
            newAppoint.zoomMeetingId = zoomMeeting.meetingId;
            newAppoint.zoomMeetingUrl = zoomMeeting.joinUrl;
            newAppoint.zoomMeetingPassword = zoomMeeting.password;
            
            await newAppoint.save();
            
            // Return success with meeting details
            return res.status(201).json({
                message: "Appointment created successfully with video consultation",
                appointmentId: newAppoint._id,
                zoomMeetingUrl: zoomMeeting.joinUrl,
                zoomMeetingPassword: zoomMeeting.password
            });
        } catch (zoomError) {
            console.error("Error creating Zoom meeting:", zoomError);
            
            // Still return success but note the Zoom meeting failed
            return res.status(201).json({
                message: "Appointment created but video consultation setup failed",
                appointmentId: newAppoint._id,
                error: zoomError.message
            });
        }
    } catch (error){
        console.error("Error creating appointment:", error);
        res.status(400).json({ message: error.message });
    }
};

//get all appointment 
const getAppointment = async(req, res) => {
    try{
        const appoint = await Appoint.find();
        res.status(200).json(appoint);    
    } catch (error) {
        res.status(404).json({ message: error.message});
    }
};

//get appointment by id
const getAppointmentById = async( req, res) => {
    try{
        const appoint = await Appoint.findById(req.params.id);
        if(!appoint){
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(200).json(appoint);
    }
    catch (error){
        res.status(500).json({ message: error.message});
    }
};

//delete appointment by id
const deleteAppointmentById = async(req, res) => {
    try{
        const appoint = await Appoint.findByIdAndDelete(req.params.id);
        if(!appoint){
            return res.status(404).json({ message: "Appointment not found"});
        }
        res.status(200).json({ message: "Appointment deleted successfully"});
    } catch(error){
        res.status(500).json({message: error.message});
    }
};


export {createAppoint, getAppointment, getAppointmentById, deleteAppointmentById};