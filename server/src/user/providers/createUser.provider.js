import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User } from '../user.schema.js';
import { validatePassword } from '../validators/createUser.validator.js';
import { sendOtpEmail } from '../../helpers/email.helper.js';

export const createUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  
  if (!validatePassword(password)) {
    throw new Error('Password must be at least 8 characters long and contain at least one uppercase, lowercase, number, and special character.');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  const user = new User({ email, password: hashedPassword, otp, otpExpiry });
  await user.save();

  await sendOtpEmail({ to: email, otp, purpose: 'signup' });

  return {
    message: 'Registration successful. OTP sent to your email.',
    email: user.email
  };
};
