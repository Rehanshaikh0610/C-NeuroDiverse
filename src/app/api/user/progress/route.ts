import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UserProgress from '@/models/UserProgress';

// Helper function to get user ID from session (same as in teacher-booking route)
async function getUserId(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.id;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}

// GET - Get user progress
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
    
    const userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      return NextResponse.json(
        { success: false, message: 'User progress not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true, 
        progress: {
          level: userProgress.level,
          points: userProgress.points,
          streakDays: userProgress.streakDays,
          badges: userProgress.badges,
          completedSections: userProgress.completedSections,
          activities: userProgress.activities.slice(-10), // Return only the last 10 activities
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { success: false, message: 'Server error fetching user progress' },
      { status: 500 }
    );
  }
}

// POST - Add activity and points to user progress
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { activityType, points, details } = await request.json();

    // Validate input
    if (!activityType || !points) {
      return NextResponse.json(
        { success: false, message: 'Please provide activity type and points' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user progress
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      // Create new progress record if it doesn't exist
      userProgress = await UserProgress.create({
        userId,
        activities: [],
      });
    }

    // Add points and activity
    userProgress.addPoints(points, activityType, details || '');
    
    // Update streak if it's a new day
    userProgress.updateStreak();
    
    // Save changes
    await userProgress.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Progress updated successfully',
        progress: {
          level: userProgress.level,
          points: userProgress.points,
          streakDays: userProgress.streakDays,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user progress:', error);
    return NextResponse.json(
      { success: false, message: 'Server error updating user progress' },
      { status: 500 }
    );
  }
} 