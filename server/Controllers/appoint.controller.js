//appoint.controller.js
import Appoint from "../Models/appoint.model.js";
import { validationResult } from "express-validator";
import {generateZoomMeeting, sendEmail} from "../zoom.service.js";

const createAppoint = async (req, res) => {
    try{
        //finding any validation error
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        //create a new appointment
        const {Speciality, Doctor, Name, Email, AppointDate, AppointTime, Phone, Reason, DocEmail} = req.body;

            const timeParts = AppointTime.split(' ');
        if(timeParts.length !==2 ){
            return res.status(400).json({ message: "Invalid time format"});
        }

        const [time, modifier] = timeParts;
        let [hours, minutes] = time.split(':').map(Number);

        //convert 24 hour to format
        if(modifier === 'PM' && hours !== 12){
            hours += 12;
        } else if (modifier === 'AM' && hours === 12){
            hours = 0;
        }

        //create the zoomStartTime
        const zoomStartTime = new Date(AppointDate);
        zoomStartTime.setHours(hours, minutes, 0, 0);
        const zoomStartTimeISO = zoomStartTime.toISOString();


        // const newAppoint = new Appoint({
        //      Speciality, Doctor, Name, Email, AppointDate, AppointTime, Phone, Reason, DocEmail, zoomMeetingLink, zoomMeetingId, zoomPassword });

             //Generate zoom meeting with the patient's email
             const zoomMeeting = await generateZoomMeeting({
                patientEmail: Email,
                startTime: zoomStartTime,
                topic: 'Appointment Meeting'
             });

        const newAppoint = new Appoint({
            Speciality, Doctor, Name, Email, AppointDate, AppointTime, Phone, Reason, DocEmail, 
            zoomMeetingLink: zoomMeeting.join_url, 
            zoomMeetingId: zoomMeeting.id, 
            zoomPassword: zoomMeeting.password });
        //save the new appointment
        await newAppoint.save();


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//styling of patient email of meeting
const patientEmailContent = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    body {font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header{ background-color: #9f0712; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;}
    .content{ padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px;}
    .details{ margin: 15px 0;}
    .detail-item{ margin-bottom: 10px;}
    .detail-label{ font-weight: bold; color: #9f0712; }
    .zoom-box{ background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;}
    .footer{ margin-top: 20px; font-size: 12px; color: #777; text-align: center; }
    .button{ background-color: #9f0712; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;}
    </style>
    </head>
    <body>
    <div class = "header">
    <h2>Appointment Booked</h2>
    </div>
    <div class= "content">
    <p> Dear ${Name},</p>
    <div class ="details">
    <div class ="detail-item"><span class = "detail-label">Doctor: </span>${Doctor}</div>
    <div class ="detail-item"><span class = "detail-label">Date: </span>${new Date(AppointDate).toLocaleDateString()}</div>
    <div class ="detail-item"><span class = "detail-label">Time: </span>${AppointTime}</div>
    </div>

    <div class = "zoom-box">
    <h3>Zoom Meeting Details</h3>
    <p><strong>Meeting Id</strong> ${zoomMeeting.id}</p>
    <p><strong>Password</strong> ${zoomMeeting.password}</p>
    <p style= "text-align: center; margin-top: 15px;">
    <a href = "${zoomMeeting.join_url}" class = "button">Join Meeting</a>
    </p>
    </div>
    
    <p>Please join 5 minutes before your scheduled time.</p>
</div>
</body>
</html>`;


//styling of doctor email of meeting
const doctorEmailContent = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    body {font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header{ background-color: #9f0712; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;}
    .content{ padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px;}
    .details{ margin: 15px 0;}
    .detail-item{ margin-bottom: 10px;}
    .detail-label{ font-weight: bold; color: #9f0712; }
    .zoom-box{ background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;}
    .footer{ margin-top: 20px; font-size: 12px; color: #777; text-align: center; }
    .button{ background-color: #9f0712; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;}
    </style>
    </head>
    <body>
    <div class = "header">
    <h2>New Appointment</h2>
    </div>
    <div class= "content">
    <p> Dear ${Doctor},</p>
    <div class ="details">
    <div class ="detail-item"><span class = "detail-label">Patient: </span>${Name}</div>
    <div class ="detail-item"><span class = "detail-label">Date: </span>${new Date(AppointDate).toLocaleDateString()}</div>
    <div class ="detail-item"><span class = "detail-label">Time: </span>${AppointTime}</div>
    </div>

    <div class = "zoom-box">
    <h3>Zoom Meeting Details</h3>
    <p><strong>Meeting Id</strong> ${zoomMeeting.id}</p>
    <p><strong>Password</strong> ${zoomMeeting.password}</p>
    <p style= "text-align: center; margin-top: 15px;">
    <a href = "${zoomMeeting.join_url}" class = "button">Join Meeting</a>
    </p>
    </div>
    
    <p>Please join 5 minutes before your scheduled time.</p>
</div>
</body>
</html>`;

const Tamd='TAMD Appointment'
await sendEmail({to:Email,subject: Tamd,html: patientEmailContent});
await sendEmail({to:DocEmail,subject: Tamd,html: doctorEmailContent});

res.status(201).json({
    success: true,
    message: 'Appointment created successfully and email sent',
    appointment: newAppoint

});

} catch (error){
    console.error("Appointment error", error);
    res.status(500).json({
    success: false,
    message: 'Failed to create appointment',
    error: error.message
    });
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


// count appointments
const countAppointments = async(req, res) => {
    try{
        const count = await Appoint.countDocuments();
        res.status(200).json({ count });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "An error occurred while counting appointments"});
    }
};

export {createAppoint, getAppointment, getAppointmentById, deleteAppointmentById, countAppointments};  


