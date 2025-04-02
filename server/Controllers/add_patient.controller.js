import add_patient from "../Models/add_patient.model.js";
import { validationResult } from "express-validator";

const addPatient = async (req, res) => {
    try {
        //finding any validation error
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const {
            firstName, lastName, email, phone, country, dateofBirth, gender, bloodGroup, medicalHistory, status, specialization
        } = req.body;

        //add patient
        const newPatient = new add_patient({
            firstName, lastName, email, phone, country, dateofBirth, gender, bloodGroup, medicalHistory, status, specialization
        });

        //save the new patient 
        await newPatient.save();
        res.status(201).json({ message: "Patient Added Successfully"});
    } catch(error){
        res.status(500).json({ message: "An error occurred while adding patient"});
    }
};

//get all patient
const getAllPatient = async (req, res) => {
    try {
        const patient = await add_patient.find();
        res.status(200).json({ patient });
    }catch{
        res.status(500).json({ message: "An error occurred while fetching the patient "});
    }
};

//get patient by id
const getPatientById = async (req, res) => {
    try{
        const id = req.params.id;
        const patient = await add_patient.findById(id);
        if(!patient){
            return res.status(404).json({ message: "Patient not found"});
        }
        res.status(200).json({ patient });
    } catch(error){
        res.status(500).json({ message: "An error occurred while fetching the patient "});
    }
};

export {addPatient, getAllPatient, getPatientById};