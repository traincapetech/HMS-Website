import express from 'express';
import { 
    registerAdmin, 
    loginAdmin, 
    getAllAdmins, 
    getAdminById, 
    updateAdmin, 
    changePassword, 
    deleteAdmin 
} from '../Controllers/admin.controller.js';
import { authenticateToken } from '../Middlewares/auth.middleware.js';
import { isAdmin } from '../Middlewares/admin.middleware.js';

const router = express.Router();

// Public routes
router.post('/login', loginAdmin);

// Protected routes (require authentication)
router.post('/register', authenticateToken, isAdmin, registerAdmin);
router.get('/all', authenticateToken, isAdmin, getAllAdmins);
router.get('/:id', authenticateToken, isAdmin, getAdminById);
router.put('/:id', authenticateToken, isAdmin, updateAdmin);
router.put('/:id/change-password', authenticateToken, isAdmin, changePassword);
router.delete('/:id', authenticateToken, isAdmin, deleteAdmin);

export default router; 