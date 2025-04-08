import express from 'express';
import { addDoc, getDoc, getDocById, deleteDoc } from '../Controllers/add_doc.controller.js';

const router = express.Router();

//Routes
router.post('/add', addDoc);
router.get('/all', getDoc);
router.get('/:id', getDocById);
router.delete('/:id',deleteDoc);


export default router;