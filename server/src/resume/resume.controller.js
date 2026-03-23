import { createResumeProvider } from './providers/createResume.provider.js';
import logger from '../helpers/winston.helper.js';

export const createResume = async (req, res) => {
  try {
    const { name, email, phone, address, education, skills, languageProficiency } = req.body;
    
    // Construct public URL for photograph
    const photographUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!photographUrl) {
      throw new Error('Photograph upload is required.');
    }

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
