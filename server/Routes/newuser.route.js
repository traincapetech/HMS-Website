//newuser.route.js
import express from 'express';
import { registerNewuser, loginNewuser, getnewUser, getnewUserById, getNewuserImage, countNewUser} from '../Controllers/newuser.controller.js';
import { authenticateToken } from '../Middlewares/auth.middleware.js';
import { uploadFiles } from '../multer.js';

const router = express.Router();

//Routes
// router.post('/register', registerNewuser);
router.post('/register', (req, res) => {
    console.log('Request Body', req.body);
    console.log('Request Files', req.files);

    uploadFiles(req, res, (err) => {
        if(err) {
            console.error('Multer Error', err);
            return res.status(400).json({ message: err.message });
        }
        console.log('Request Files', req.files);
        registerNewuser(req, res);
    });
});
router.post('/login', loginNewuser);
router.get('/all', getnewUser);
router.get('/count', countNewUser);
router.get('/:id', getnewUserById);


//routes for fetching image
router.get('/:id/image', getNewuserImage);

export default router;