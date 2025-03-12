import express from "express";
import { createAppoint, getAppointment, getAppointmentById } from "../Controllers/appoint.controller.js";

const router = express.Router();

//Routes
router.post('/create', createAppoint);
router.get('/all', getAppointment);
router.get('/:id', getAppointmentById);

export default router;