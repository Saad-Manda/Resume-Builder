import { Resume } from '../resume.schema.js';

export const createResumeProvider = async (resumeData) => {
  const resume = new Resume(resumeData);
  await resume.save();
  return resume;
};
