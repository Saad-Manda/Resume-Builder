import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './settings/config.js';
import logger from './helpers/winston.helper.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Resume Builder API' });
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
