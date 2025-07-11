import express from 'express';
import { register, login, logout, getMe, refreshToken } from '@controllers/authController';
import { authenticate } from '@middleware/auth';
import { validateRegistration, validateLogin } from '@middleware/validation';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get('/me', authenticate, getMe);

export default router;
