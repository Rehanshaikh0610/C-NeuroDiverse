import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Count the number of users in the database
    const userCount = await User.countDocuments();
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to MongoDB',
      data: {
        userCount
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to connect to database',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 