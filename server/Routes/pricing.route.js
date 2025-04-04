import express from 'express';
import {
    createPricing,
    getAllPricing,
    getPricingById,
    updatePricing,
    deletePricing,
    hardDeletePricing
} from '../Controllers/pricing.controller.js';
import { authenticateToken } from '../Middlewares/auth.middleware.js';
import { isAdmin, canManagePricing } from '../Middlewares/admin.middleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/all', getAllPricing);
router.get('/:id', getPricingById);

// Protected routes (admin only)
router.post('/', authenticateToken, isAdmin, canManagePricing, createPricing);
router.put('/:id', authenticateToken, isAdmin, canManagePricing, updatePricing);
router.delete('/:id', authenticateToken, isAdmin, canManagePricing, deletePricing);
router.delete('/:id/permanent', authenticateToken, isAdmin, canManagePricing, hardDeletePricing);

export default router; 