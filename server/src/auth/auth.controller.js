import { loginWithEmailAndPassword } from './providers/login.provider.js';
import { verifyOtpProvider } from './providers/verifyOtp.provider.js';
import logger from '../helpers/winston.helper.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginWithEmailAndPassword({ email, password });
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Login failed: ${error.message}`);
    return res.status(401).json({ error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyOtpProvider({ email, otp });
    logger.info(`User logged in successfully: ${email}`);
    return res.status(200).json(result);
  } catch (error) {
    logger.error(`OTP Verification failed: ${error.message}`);
    return res.status(401).json({ error: error.message });
  }
};
