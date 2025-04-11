//doctor.controller.js
import Doctor from "../Models/doctor.model.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const registerDoctor = async (req, res)=> {
    try{
        //finding any validation error
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const{
            Name, Email, Password, Phone, DOB, Gender, CountryCode, Country, City, State, Expertise, Speciality, Experience, Hospital, ConsultType, Fees, Address,LicenseNo,Education
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
            Name, Email, Password: hashedPassword, Phone, DOB, Gender, CountryCode, Country, City, State, Expertise, Speciality, Experience, Hospital, ConsultType, Fees, Address,LicenseNo,Education,
            
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

//Login a doctor
const loginDoctor = async(req, res) => {
    try{
        const {Email, Password} = req.body;

        //check if the user exists
        const user = await Doctor.findOne({Email});
        if(!user) {
            return res.status(404).json({message: "Doctor not found"});
        }
        //compare the password with the store hashed password
        const isMatch = await bcrypt.compare(Password, user.Password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid Password"});
        }

        //generate a JWT token
        const token = jwt.sign(
            {userId : user._id, Email: user.Email},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        res.status(200).json({message: "Login Successfully", token,
            user: {
                Name: user.Name,
                Email: user.Email,
                Phone: user.Phone,
                DOB: user.DOB,
                Gender: user.Gender,
                CountryCode: user.CountryCode,
                Country: user.Country,
                City: user.City,
                State: user.State,
                Expertise: user.Expertise,
                Speciality: user.Speciality,
                Experience: user.Experience,
                Hospital: user.Hospital,
                ConsultType: user.ConsultType,
                Fees: user.Fees,
                Address: user.Address,    
                LicenseNo: user.LicenseNo,               
                Education: user.Education,                                                
            }
        });
    } catch (error){
        console.error(error);
        res.status(500).json({message: "An error occurred during Login"});
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

//serve doctor's document
const getDoctorDocument = async (req, res) => {
    try{
        const doctor = await Doctor.findById(req.params.id);
        console.log('Doctor: ', doctor);

        if(!doctor || ! doctor.document.data){
            return res.status(404).json({ message: "Document not found"});
        }

        //set headers for pdf
        res.setHeader('content-type', doctor.document.contentType);
        res.setHeader('Content-Disposition', 'inline; filename = "doctor-document.pdf');

        //send the buffer as a response
        res.send(doctor.document.data);
    }
        catch(error) {
        console.error(error);
        res.status(500).json({ message: "An error occured while fetching the document"});
    }
};

//serve the doctor's image
const getDoctorImage = async(req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id); 
        if(!doctor || !doctor.image.data) {
            return res.status(404).json({ message: 'Image not found'});
        }
        
        //set headers for image
        res.setHeader('Content-Type', doctor.image.contentType);
        res.setHeader('Content-Disposition', 'inline; filename = "doctor-image.png"');

        //send the buffer as response
        res.send(doctor.image.data);
    }catch (error){
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the image "});
    }
};

//count the doctors
const countDoctors = async(req, res) => {
    try{
    const count = await Doctor.countDocuments();
    res.status(200).json({ count});
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: ' An error occurred while counting the doctors'});
    }
};

export {registerDoctor, getDoctor, getDoctorById, getDoctorDocument, getDoctorImage, loginDoctor, countDoctors};