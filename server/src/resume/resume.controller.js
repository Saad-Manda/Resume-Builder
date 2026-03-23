import { createResumeProvider } from './providers/createResume.provider.js';
import { getResumesProvider } from './providers/getResume.provider.js';
import logger from '../helpers/winston.helper.js';

export const createResume = async (req, res) => {
  try {
    const { name, email, phone, address, education, skills, languageProficiency } = req.body;
    
    // Construct public URL for photograph (optional now)
    const photographUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const resumeData = {
      userId: req.user.userId,
      name,
      email,
      phone,
      address,
      education,
      skills,
      languageProficiency,
      photographUrl
    };

    const resume = await createResumeProvider(resumeData);
    logger.info(`Resume created successfully for user _id: ${req.user.userId}`);
    
    return res.status(201).json({ message: 'Resume created successfully.', resume });
  } catch (error) {
    logger.error(`Failed to create resume: ${error.message}`);
    return res.status(400).json({ error: error.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const resumes = await getResumesProvider(req.user.userId);
    return res.status(200).json({ resumes });
  } catch (error) {
    logger.error(`Failed to fetch resumes: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
