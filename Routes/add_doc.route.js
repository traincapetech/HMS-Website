import express from 'express';
import { addDoc, getDoc, getDocById } from '../Controllers/add_doc.controller.js';

const router = express.Router();

//Routes
router.post('/add', addDoc);
router.get('/all', getDoc);
router.get('/:id', getDocById);


export default router;