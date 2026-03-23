import { Router } from 'express';
import { createResume, getResume } from './resume.controller.js';
import { authenticateToken } from '../middleware/authenticateToken.middleware.js';
import { upload } from '../middleware/fileUpload.middleware.js';

const router = Router();

// POST /api/resume
// Uploads 'photograph' file and saves resume data
router.post('/', authenticateToken, upload.single('photograph'), createResume);

// GET /api/resume
router.get('/', authenticateToken, getResume);

export default router;
