import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import UserProgress from '@/models/UserProgress';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Update user progress for login activity
    let userProgress = await UserProgress.findOne({ userId: user._id });
    
    if (!userProgress) {
      // Create progress record if it doesn't exist
      userProgress = await UserProgress.create({
        userId: user._id,
        activities: [{
          type: 'login',
          points: 5,
          details: 'Daily login',
        }],
      });
    } else {
      // Add login activity and update streak
      userProgress.updateStreak();
      userProgress.addPoints(5, 'login', 'Daily login');
      await userProgress.save();
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        name: user.name,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie with token
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          level: user.level || 1,
          points: user.points || 0,
          streakDays: user.streakDays || 0
        }
      },
      { status: 200 }
    );

    // Set HTTP-only cookie with token
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during login' },
      { status: 500 }
    );
  }
} 