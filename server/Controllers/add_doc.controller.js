import mongoose from "mongoose";
import Add_doc from "../Models/add_doc.model.js";
import { validationResult } from "express-validator";

const addDoc = async (req, res) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, specialization, experience, phone, address, country, status } = req.body;

        // Ensure status is always a valid string ("active" or "inactive")
        const validatedStatus = status === "active" ? "active" : "inactive";

        // Create a new doctor record
        const newDoc = new Add_doc({
            name, 
            email, 
            specialization, 
            experience, 
            phone, 
            address, 
            country, 
            status: validatedStatus
        });

        // Save the doctor in the database
        await newDoc.save();
        res.status(201).json({ message: "Doctor added successfully", doctor: newDoc });
    } catch (error) {
        console.error("Error in addDoc:", error);
        res.status(500).json({ message: "An error occurred while adding the doctor" });
    }
};

// Get all doctors
const getDoc = async (req, res) => {
    try {
        const { status, specialization, country } = req.query;

        // Filter conditions
        const filter = {};
        if (status) filter.status = status;
        if (specialization) filter.specialization = specialization;
        if (country) filter.country = country;

        const docs = await Add_doc.find(filter);
        res.status(200).json({ doctors: docs });
    } catch (error) {
        console.error("Error in getDoc:", error);
        res.status(500).json({ message: "An error occurred while fetching the doctors" });
    }
};

// Get doctor by ID
const getDocById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId to prevent CastError
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid doctor ID" });
        }

        const doc = await Add_doc.findById(id);
        if (!doc) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({ doctor: doc });
    } catch (error) {
        console.error("Error in getDocById:", error);
        res.status(500).json({ message: "An error occurred while fetching the doctor" });
    }
};

export { addDoc, getDoc, getDocById };
