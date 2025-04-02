import { addPatient, getAllPatient, getPatientById } from "../Controllers/add_patient.controller.js";
import express from "express";

const router = express.Router();

//Routes
router.post('/add', addPatient);
router.get('/all', getAllPatient);
router.get('/:id', getPatientById);

export default router;