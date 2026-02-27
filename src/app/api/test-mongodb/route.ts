import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';

export async function GET() {
  try {
    // Connect to the database
    const mongoose = await connectToDatabase();
    
    // Return success response with connection information
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to MongoDB',
      data: {
        connection: {
          host: mongoose.connection.host,
          name: mongoose.connection.name,
          port: mongoose.connection.port,
          readyState: mongoose.connection.readyState
        }
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