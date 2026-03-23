import { Router } from 'express';
import { registerUser } from './user.controller.js';

const router = Router();

// POST /api/user/register
router.post('/register', registerUser);

export default router;
