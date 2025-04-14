import express from "express";
import { createAppoint, getAppointment, getAppointmentById, deleteAppointmentById, countAppointments, getDocumentById } from "../Controllers/appoint.controller.js";
import { uploadFiles } from "../multer.js";

const router = express.Router();

//Routes
router.post('/create', uploadFiles,createAppoint);
router.get('/all', getAppointment);
router.get('/count', countAppointments);
router.get('/:id', getAppointmentById);
router.get('/:id/document', getDocumentById);
router.delete('/:id', deleteAppointmentById);



export default router;