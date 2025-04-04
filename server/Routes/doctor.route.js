//doctor.route.js
import express from 'express';
import { registerDoctor, getDoctor, getDoctorById, getDoctorDocument, getDoctorImage, loginDoctor } from '../Controllers/doctor.controller.js';
import { uploadFiles } from '../multer.js';

const router = express.Router();

//Routes
router.post('/register', (req, res) => {
    console.log('Request Body', req.body);
    console.log('Request Files', req.files);

    uploadFiles(req, res, (err) => {
        if(err) {
            console.error('Multer Error', err);
            return res.status(400).json({ message: err.message });
        }
        console.log('Request Files', req.files);
        registerDoctor(req, res);
    });
});

router.post('/login', loginDoctor);
router.get('/all', getDoctor);
router.get('/:id', getDoctorById);



//routes for fetching document and image
router.get('/:id/document', getDoctorDocument);
router.get('/:id/image', getDoctorImage);

export default router;