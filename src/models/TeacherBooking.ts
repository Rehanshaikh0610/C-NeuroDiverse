import mongoose from 'mongoose';

// Define the TeacherBooking schema
const teacherBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  teacherId: {
    type: String,
    required: [true, 'Teacher ID is required'],
  },
  teacherName: {
    type: String,
    required: [true, 'Teacher name is required'],
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: ['Autism', 'ADHD', 'Dyslexia'],
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required'],
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  notes: {
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
  reminderSent: {
    type: Boolean,
    default: false,
  },
});

// Create and export the TeacherBooking model
export default mongoose.models.TeacherBooking || mongoose.model('TeacherBooking', teacherBookingSchema); 