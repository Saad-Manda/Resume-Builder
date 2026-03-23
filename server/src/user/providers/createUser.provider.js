import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../user.schema.js';
import { validatePassword } from '../validators/createUser.validator.js';
import { config } from '../../settings/config.js';

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

  const user = new User({ email, password: hashedPassword });
  await user.save();

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    config.jwtSecret,
    { expiresIn: '1d' }
  );

  return { token, user: { _id: user._id, email: user.email } };
};
