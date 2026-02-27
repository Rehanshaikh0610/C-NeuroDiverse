import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import UserProgress from '@/models/UserProgress';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 400 }
      );
    }

    // Create new user (password will be hashed by the pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      level: 1,
      points: 10,
      streakDays: 1
    });

    // Create user progress record
    await UserProgress.create({
      userId: user._id,
      // Add initial login activity
      activities: [{
        type: 'login',
        points: 10,
        details: 'Initial registration',
      }],
    });

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          level: user.level,
          points: user.points,
          streakDays: user.streakDays
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during registration' },
      { status: 500 }
    );
  }
} 