import { Router } from 'express';
import { login, verifyOtp } from './auth.controller.js';

const router = Router();

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOtp);

export default router;
