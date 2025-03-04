//appoint.controller.js
import Appoint from "../Models/appoint.model.js";
import { validationResult } from "express-validator";

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
        res.status(201).json(newAppoint);
    } catch (error){
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

export {createAppoint, getAppointment, getAppointmentById};