import jwt from 'jsonwebtoken';
import { User } from '../../user/user.schema.js';
import { config } from '../../settings/config.js';

export const verifyOtpProvider = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new Error('Email and OTP are required.');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found.');
  }

  if (user.otp !== otp) {
    throw new Error('Invalid OTP.');
  }

  if (user.otpExpiry < new Date()) {
    throw new Error('OTP has expired.');
  }

  // Clear OTP
  user.otp = null;
  user.otpExpiry = null;
  user.isVerified = true;
  await user.save();

  // Generate JWT
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    config.jwtSecret,
    { expiresIn: '1d' }
  );

  return { token, user: { _id: user._id, email: user.email } };
};
