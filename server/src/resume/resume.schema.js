import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  education: { type: String, required: true },
  skills: { type: String, required: true },
  languageProficiency: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  photographUrl: { type: String, required: true }
}, { timestamps: true });

export const Resume = mongoose.model('Resume', resumeSchema);
