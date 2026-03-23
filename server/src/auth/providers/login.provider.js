import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User } from '../../user/user.schema.js';
import logger from '../../helpers/winston.helper.js';

export const loginWithEmailAndPassword = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  // Simulate OTP sending
  logger.info(`=========================================`);
  logger.info(`MOCK OTP FOR ${email}: ${otp}`);
  logger.info(`=========================================`);

  return { message: 'OTP generated and sent successfully.', email: user.email };
};
