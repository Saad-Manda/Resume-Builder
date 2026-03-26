import dotenv from 'dotenv';
dotenv.config();

const parseEmailPort = (rawPort) => {
  if (!rawPort) return undefined;

  // Supports values like "465" and tolerates accidental inline comments.
  const cleanedPort = rawPort.split('#')[0].trim();
  const parsed = Number(cleanedPort);

  return Number.isNaN(parsed) ? undefined : parsed;
};

export const config = {
  port: process.env.PORT || 5000,
  dbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  env: process.env.NODE_ENV || 'development',
  emailHost: process.env.EMAIL_HOST,
  emailPort: parseEmailPort(process.env.EMAIL_PORT),
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  emailFrom: process.env.EMAIL_FROM
};
