import { Resume } from '../resume.schema.js';

export const getResumesProvider = async (userId) => {
  const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
  return resumes;
};
