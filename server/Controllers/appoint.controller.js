//appoint.controller.js
import Appoint from "../Models/appoint.model.js";
import { validationResult } from "express-validator";
// import { generateZoomMeeting } from "../zoom.service.js";

const createAppoint = async (req, res) => {
    try{
        //finding any validation error
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        //create a new appointment
        const {Speciality, Doctor, Name, Email, AppointDate, AppointTime} = req.body;

        const newAppoint = new Appoint({
             Speciality, Doctor, Name, Email, AppointDate, AppointTime });
        await newAppoint.save();

        // //call the zoom meeting generation with the patient Email
        // await generateZoomMeeting(Email);

        res.status(201).json(newAppoint);
    } catch (error){
        res.status(400).json({ message: error.message });
    }
};




// //Generate a zoom meeting with patient
// const zoomMeeting  = await generateZoomMeeting({
//     patientEmail: Email,
//     startTime: AppointTime,
//     topic: 'Appointment Meeting'
// });

// //Add the zoom meeting link to the appointment 
// newAppoint.zoomMeetingLink = zoomMeeting.join_url;
// await newAppoint.save();
 
// res.status(201).json({ appointment: newAppoint, zoomMeeting });
// ////

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