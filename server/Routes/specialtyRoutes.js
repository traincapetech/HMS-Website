import express from 'express';
import { getAllSpecialties } from '../Controllers/specialty.controller.js';

const router = express.Router();

router.get('/', getAllSpecialties);

export default router; 