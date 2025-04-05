import express from 'express';
import { 
  registerDoctor, 
  getDoctor, 
  getDoctorById, 
  getDoctorDocument, 
  getDoctorImage, 
  loginDoctor 
} from '../Controllers/doctor.controller.js';
import { 
  getDoctorStatistics,
  getDoctorPatients,
  getDoctorTodayAppointments,
  getDoctorPendingPrescriptions 
} from '../controllers/doctorStatistics.js';
import { authenticateToken } from '../Middlewares/auth.middleware.js';

const router = express.Router();

// Existing doctor routes
router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.get('/', getDoctor);
router.get('/:id', getDoctorById);
router.get('/:id/document', getDoctorDocument);
router.get('/:id/image', getDoctorImage);

// New statistic routes - protected by authentication
router.get('/statistics/:doctorId', authenticateToken, getDoctorStatistics);
router.get('/patients/:doctorId', authenticateToken, getDoctorPatients);
router.get('/appointments/today/:doctorId', authenticateToken, getDoctorTodayAppointments);
router.get('/prescriptions/pending/:doctorId', authenticateToken, getDoctorPendingPrescriptions);

export default router; 