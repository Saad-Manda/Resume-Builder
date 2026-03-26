import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User } from '../../user/user.schema.js';
import { sendOtpEmail } from '../../helpers/email.helper.js';
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

  if (!user.isVerified) {
    const signupOtp = crypto.randomInt(100000, 999999).toString();
    const signupOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = signupOtp;
    user.otpExpiry = signupOtpExpiry;
    await user.save();

    await sendOtpEmail({ to: email, otp: signupOtp, purpose: 'signup' });

    return {
      message: 'Your account is not verified yet. OTP sent to your email for verification.',
      email: user.email,
      requiresVerification: true
    };
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  await sendOtpEmail({ to: email, otp, purpose: 'login' });
  logger.info(`Login OTP generated for ${email}`);

  return { message: 'OTP sent successfully to your email.', email: user.email };
};
