import connectToDatabase from '@/lib/mongodb';
import TeacherBooking from '@/models/TeacherBooking';
import UserProgress from '@/models/UserProgress';

export async function getUserBookings(userId: string) {
  try {
    await connectToDatabase();
    
    const bookings = await TeacherBooking.find({ userId }).sort({ bookingDate: -1 });
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}

export async function getBookingById(bookingId: string, userId: string) {
  try {
    await connectToDatabase();
    
    const booking = await TeacherBooking.findOne({ _id: bookingId, userId });
    if (!booking) {
      throw new Error('Booking not found or unauthorized');
    }
    
    return booking;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
}

export async function createBooking(userId: string, bookingData: any) {
  try {
    await connectToDatabase();
    
    // Create new booking
    const booking = await TeacherBooking.create({
      userId,
      ...bookingData,
      status: 'pending',
    });
    
    // Update user progress for booking activity
    const userProgress = await UserProgress.findOne({ userId });
    if (userProgress) {
      userProgress.addPoints(20, 'teacher_booking', `Booked session with ${bookingData.teacherName}`);
      await userProgress.save();
    }
    
    return booking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function updateBookingStatus(bookingId: string, userId: string, status: string) {
  try {
    await connectToDatabase();
    
    // Find booking
    const booking = await TeacherBooking.findOne({ _id: bookingId, userId });
    if (!booking) {
      throw new Error('Booking not found or unauthorized');
    }
    
    // Update status
    booking.status = status;
    booking.updatedAt = new Date();
    await booking.save();
    
    // If booking is completed, add extra points
    if (status === 'completed') {
      const userProgress = await UserProgress.findOne({ userId });
      if (userProgress) {
        userProgress.addPoints(30, 'teacher_booking', `Completed session with ${booking.teacherName}`);
        await userProgress.save();
      }
    }
    
    return booking;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

export async function cancelBooking(bookingId: string, userId: string) {
  try {
    await connectToDatabase();
    
    // Find booking
    const booking = await TeacherBooking.findOne({ _id: bookingId, userId });
    if (!booking) {
      throw new Error('Booking not found or unauthorized');
    }
    
    // Update status to cancelled
    booking.status = 'cancelled';
    booking.updatedAt = new Date();
    await booking.save();
    
    return booking;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
}