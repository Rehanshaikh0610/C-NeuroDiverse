import mongoose from 'mongoose';

// Define the Feedback schema
const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['general', 'content', 'teacher', 'technical', 'suggestion'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot be more than 1000 characters'],
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
  adminResponse: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Feedback model
export default mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema); 