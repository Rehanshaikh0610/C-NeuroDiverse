import mongoose from 'mongoose';

// Define the UserProgress schema
const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true,
  },
  points: {
    type: Number,
    default: 0,
    min: 0,
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
  },
  activities: [{
    type: {
      type: String,
      required: true,
      enum: ['login', 'lesson_completed', 'quiz_completed', 'teacher_booking', 'diary_entry', 'meditation_session', 'chat_interaction', 'resource_accessed'],
    },
    points: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    details: {
      type: String,
      default: '',
    },
  }],
  streakDays: {
    type: Number,
    default: 0,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  badges: [{
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
    icon: {
      type: String,
      default: 'trophy',
    },
  }],
  completedSections: {
    autism: {
      type: Number,
      default: 0,
    },
    adhd: {
      type: Number,
      default: 0,
    },
    dyslexia: {
      type: Number,
      default: 0,
    },
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

// Helper method to calculate level based on points
userProgressSchema.methods.calculateLevel = function() {
  // Simple level calculation: level = 1 + Math.floor(points / 100)
  // This means every 100 points, the user gains a level
  this.level = 1 + Math.floor(this.points / 100);
  return this.level;
};

// Helper method to add points and update level
userProgressSchema.methods.addPoints = function(points, activityType, details = '') {
  this.points += points;
  this.activities.push({
    type: activityType,
    points: points,
    timestamp: new Date(),
    details: details,
  });
  this.calculateLevel();
  this.lastActive = new Date();
  return this.points;
};

// Helper method to update streak
userProgressSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastActive = this.lastActive;
  
  // Calculate days between last activity and now
  const dayDifference = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
  
  if (dayDifference === 1) {
    // User was active yesterday, increment streak
    this.streakDays += 1;
  } else if (dayDifference > 1) {
    // User missed a day, reset streak
    this.streakDays = 1;
  }
  // If dayDifference is 0, user was already active today, don't change streak
  
  this.lastActive = now;
  return this.streakDays;
};

// Create and export the UserProgress model
export default mongoose.models.UserProgress || mongoose.model('UserProgress', userProgressSchema); 