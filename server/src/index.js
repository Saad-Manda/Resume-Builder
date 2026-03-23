import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './settings/config.js';
import logger from './helpers/winston.helper.js';

import path from 'path';
import userRouter from './user/user.router.js';
import authRouter from './auth/auth.router.js';
import resumeRouter from './resume/resume.router.js';
import { actionLogger } from './middleware/actionLogger.middleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(actionLogger); // Intercept all requests for logging

// Serve static uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/resume', resumeRouter);

// Serve React frontend static files
const frontendPath = path.join(process.cwd(), '..', 'client', 'dist');
app.use(express.static(frontendPath));

// Serve index.html for all non-API routes (React Router SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Database Connection
if (!config.dbUri) {
  logger.error('CRITICAL: MONGODB_URI is not defined in .env file.');
} else {
  mongoose.connect(config.dbUri)
    .then(() => logger.info('Connected to MongoDB'))
    .catch((err) => logger.error(`MongoDB connection error: ${err.message}`));
}

// Start Server
app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
