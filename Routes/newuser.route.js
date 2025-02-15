//newuser.route.js
import express from 'express';
import { registerNewuser, loginNewuser, getnewUser, getnewUserById } from '../Controllers/newuser.controller.js';
import { authenticateToken } from '../Middlewares/auth.middleware.js';

const router = express.Router();

//Routes
router.post('/register', registerNewuser);
router.post('/login', loginNewuser);
router.get('/all', authenticateToken, getnewUser);
router.get('/:id', authenticateToken, getnewUserById);

export default router;