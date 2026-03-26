import nodemailer from 'nodemailer';
import { config } from '../settings/config.js';
import logger from './winston.helper.js';

const validateEmailConfig = () => {
  const required = ['emailHost', 'emailPort', 'emailUser', 'emailPass', 'emailFrom'];
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(`Missing email configuration: ${missing.join(', ')}`);
  }
};

const createTransporter = () => {
  validateEmailConfig();

  const isSecure = config.emailPort === 465;

  return nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    secure: isSecure,
    auth: {
      user: config.emailUser,
      pass: config.emailPass
    }
  });
};

export const sendOtpEmail = async ({ to, otp, purpose }) => {
  if (!to || !otp) {
    throw new Error('Recipient email and OTP are required to send OTP email.');
  }

  const transporter = createTransporter();
  const subject = purpose === 'signup' ? 'Verify your new account' : 'Your login verification OTP';
  const intro =
    purpose === 'signup'
      ? 'Use the OTP below to complete your account verification.'
      : 'Use the OTP below to complete your login.';

  await transporter.sendMail({
    from: config.emailFrom,
    to,
    subject,
    text: `${intro}\n\nOTP: ${otp}\n\nThis OTP expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h2 style="margin-bottom: 8px;">Resume Builder Verification</h2>
        <p>${intro}</p>
        <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px; margin: 16px 0;">${otp}</p>
        <p style="margin-top: 0;">This OTP expires in 10 minutes.</p>
      </div>
    `
  });

  logger.info(`OTP email sent successfully to ${to}`);
};
