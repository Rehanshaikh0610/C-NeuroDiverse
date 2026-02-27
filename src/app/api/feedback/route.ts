import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import UserProgress from '@/models/UserProgress';

// Helper function to get user ID from session (same as in other routes)
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

// GET - Get all feedback for the current user
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
    
    const feedback = await Feedback.find({ userId }).sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, feedback },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { success: false, message: 'Server error fetching feedback' },
      { status: 500 }
    );
  }
}

// POST - Submit new feedback
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { rating, category, title, message } = await request.json();

    // Validate input
    if (!rating || !category || !title || !message) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Create new feedback
    const feedback = await Feedback.create({
      userId,
      rating,
      category,
      title,
      message,
    });

    // Update user progress for feedback activity
    const userProgress = await UserProgress.findOne({ userId });
    if (userProgress) {
      userProgress.addPoints(10, 'feedback', `Submitted feedback: ${title}`);
      await userProgress.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback submitted successfully',
        feedback,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { success: false, message: 'Server error submitting feedback' },
      { status: 500 }
    );
  }
} 