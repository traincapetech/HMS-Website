import express from "express";
import { createAppoint, getAppointment, getAppointmentById, deleteAppointmentById } from "../Controllers/appoint.controller.js";

const router = express.Router();

//Routes
router.post('/create', createAppoint);
router.get('/all', getAppointment);
router.get('/:id', getAppointmentById);
router.delete('/:id', deleteAppointmentById);


export default router;