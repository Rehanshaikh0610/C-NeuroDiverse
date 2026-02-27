import { NextRequest, NextResponse } from 'next/server';
import { getChatHistory } from '@/services/chatService';
import connectToDatabase from '@/lib/mongodb';

// Helper function to get user ID from session
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

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB database first
    await connectToDatabase();
    
    // Get session ID from query parameters
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }
    
    // Get user ID from session
    const userId = await getUserId(request) || 'anonymous';
    
    // Get chat history from database
    const messages = await getChatHistory(userId, sessionId);
    
    return NextResponse.json({ messages, sessionId });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}