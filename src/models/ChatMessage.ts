import mongoose from 'mongoose';

// Define the ChatMessage schema
const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  text: {
    type: String,
    required: [true, 'Message text is required'],
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: [true, 'Sender is required'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
  },
});

// Create and export the ChatMessage model
export default mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);