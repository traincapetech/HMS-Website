import express from "express";
import { createPrescription, getPrescriptionsByPatient, updatePrescription, deletePrescription } from '../Controllers/prescription.controller.js';

const router = express.Router();

// Routes for prescriptions
router.post('/', createPrescription);
router.get('/patient/:patientId', getPrescriptionsByPatient);
router.put('/:id', updatePrescription);
router.delete('/:id', deletePrescription);

export default router; 