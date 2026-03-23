import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null if action is performed by an unauthenticated user
  },
  inputString: {
    type: String, // Stringified JSON of req.body or req.query
    required: true
  },
  outputResult: {
    type: String, // Stringified JSON of response
    required: true
  }
}, { timestamps: true });

export const Log = mongoose.model('Log', logSchema);
