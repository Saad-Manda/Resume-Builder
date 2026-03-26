import { createUser } from './providers/createUser.provider.js';
import logger from '../helpers/winston.helper.js';

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await createUser({ email, password });
    
    logger.info(`User registered successfully: ${email}`);
    return res.status(201).json(result);
  } catch (error) {
    logger.error(`Registration failed: ${error.message}`);
    return res.status(400).json({ error: error.message });
  }
};
