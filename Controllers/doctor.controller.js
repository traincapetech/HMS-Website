//doctor.controller.js
import Doctor from "../Models/doctor.model.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

const registerDoctor = async (req, res)=> {
    try{
        //finding any validation error
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const{
            Name, Email, Password, Phone, DOB, Gender, CountryCode, Country, City, State, Expertise, Speciality, Experience, Hospital, ConsultType, Fees, Address
        } = req.body;

        //check if the email is already in use
        const existingDoctor = await Doctor.findOne({Email});
        if (existingDoctor){
            return res.status(400).json({message: "Email is already in use"});
        }

        //Log the files to see their content 
        console.log('uploaded Document: ', req.files['document']);
        console.log('uploaded Image:', req.files['image']);

        //Ensure files are uploaded and exists in req.files
        const document = req.files['document'] && req.files['document'][0];
        const image = req.files['image'] && req.files['image'][0];

        if(!document || !image){
            return res.status(400).json({message: "Document and Image are required"});
        }

        //hashing the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        //create new doctor
        const doctor = new Doctor({
            Name, Email, Password: hashedPassword, Phone, DOB, Gender, CountryCode, Country, City, State, Expertise, Speciality, Experience, Hospital, ConsultType, Fees, Address,
            
            document: {
                data: document.buffer,
                contentType: document.mimetype,
            },
            image: {
                data: image.buffer,
                contentType: image.mimetype,
            },
        });

        //save the new doctor
        await doctor.save();

        res.status(201).json({message: "Doctor successfully created", doctor: doctor});
    }
    catch (error){
        console.error(error);
        res.status(500).json({message: "An error occured while registering new Doctor"});
    }
};

//get all doctor's data
const getDoctor = async(req, res) => {
    try{
        const doctor = await Doctor.find();
        res.status(200).json({doctor});
    }
    catch (error){
        console.error(error);
        res.status(500).json({message: " An error occurred while fetching the data"});
    }
};

//get doctor's data by id
const getDoctorById = async(req, res) => {
    try{
        const doctor = await Doctor.findById(req.params.id);
        if(!doctor){
            return res.status(404).json({message: "Doctor not Found"});
        }
        res.status(200).json({doctor});
    }
    catch (error){
        console.error(error);
        res.status(500).json({message: "An error occurred while fetching the data"});
    }
};

export {registerDoctor, getDoctor, getDoctorById};