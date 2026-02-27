import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import TeacherBooking from '@/models/TeacherBooking';
import UserProgress from '@/models/UserProgress';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Helper function to get user ID from session
async function getUserId(req: NextRequest) {
  try {
    // For simplicity, we'll extract user ID from the auth token
    // In a real app, you would use a proper auth solution like NextAuth.js
    const token = req.cookies.get('auth_token')?.value;
    
    if (!token) {
      return null;
    }
    
    // Decode token to get user ID (simplified for this example)
    // In a real app, you would verify the token
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.id;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}

// GET - Get all bookings for the current user
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    const bookings = await TeacherBooking.find({ userId }).sort({ bookingDate: -1 });
    
    return NextResponse.json(
      { success: true, bookings },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, message: 'Server error fetching bookings' },
      { status: 500 }
    );
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { teacherId, teacherName, specialization, bookingDate, timeSlot, notes } = await request.json();

    // Validate input
    if (!teacherId || !teacherName || !specialization || !bookingDate || !timeSlot) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Create new booking
    const booking = await TeacherBooking.create({
      userId,
      teacherId,
      teacherName,
      specialization,
      bookingDate: new Date(bookingDate),
      timeSlot,
      notes: notes || '',
      status: 'pending',
    });

    // Update user progress for booking activity
    const userProgress = await UserProgress.findOne({ userId });
    if (userProgress) {
      userProgress.addPoints(20, 'teacher_booking', `Booked session with ${teacherName}`);
      await userProgress.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Booking created successfully',
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, message: 'Server error creating booking' },
      { status: 500 }
    );
  }
}

// PATCH - Update a booking status
export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { bookingId, status } = await request.json();

    // Validate input
    if (!bookingId || !status) {
      return NextResponse.json(
        { success: false, message: 'Please provide booking ID and status' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find and update booking
    const booking = await TeacherBooking.findById(bookingId);
    
    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if user owns this booking
    if (booking.userId.toString() !== userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to update this booking' },
        { status: 403 }
      );
    }

    booking.status = status;
    booking.updatedAt = new Date();
    await booking.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Booking updated successfully',
        booking,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, message: 'Server error updating booking' },
      { status: 500 }
    );
  }
} 