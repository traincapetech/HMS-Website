import Add_doc from "../Models/add_doc.model.js";
import { validationResult } from "express-validator";

const addDoc = async (req, res) => {
    try {
        //finding any validation error
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const {
            name, email, specialization, experience, phone, address, country, status
        } = req.body;

        //add doctor
        const newDoc = new Add_doc({
            name, email, specialization, experience, phone, address, country, status
        });

        //save the new doc
        await newDoc.save();
        res.status(201).json({ message: "Doctor added successfully"});
    } catch (error){
        console.error(error);
        res.status(500).json({ message: "An error occured while adding the doctor"});
    }
};

//get all doctors
const getDoc = async (req, res) => {
    try {
        const docs = await Add_doc.find();
        res.status(200).json({ docs });
    }catch{
        res.status(500).json({ message: "An error occured while fetching the doctors"});
    }
};

//get doc by id
const getDocById = async (req, res) => {
    try {
        const id = req.params.id;
        const doc = await Add_doc.findById(id);
        if(!doc){
            return res.status(404).json({ message: "Doctor not found"});
        }
        res.status(200).json({ doc });
    } catch(errors){
        console.error(errors);
        res.status(500).json({ message: "An error occured while fetching the doctor"});
    }
};

export {addDoc, getDoc, getDocById};