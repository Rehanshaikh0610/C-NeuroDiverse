import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { saveChatMessage } from '@/services/chatService';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/mongodb';

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY;

// System prompt for the chatbot
const systemPrompt = `You are MindMitra, a highly empathetic, soothing, and gentle companion bot designed specifically for neurodivergent individuals (Autism, ADHD, Dyslexia).

Guidelines:
1. Keep your responses short, clear, and easy to read.
2. Be exceedingly patient, warm, and validating.
3. After validating feelings, gently ask exactly ONE open-ended follow-up question to learn about their state of mind or hobbies.
4. Avoid metaphors or sarcasm. Be literal.
5. Use simple and relatable words.
6. Make the user feel comfortable and heard.

If after 3-4 exchanges you detect signs of conditions like Autism, ADHD, or Dyslexia, mention it sensitively:
"Based on what you've shared, I notice some patterns that might be related to [DISORDER]. It's important to remember that only a professional can diagnose this, but I can share helpful resources."`;

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

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured in environment variables');
      return NextResponse.json({
        error: 'API key is not configured. Please set GEMINI_API_KEY environment variable.',
        response: 'I am having trouble connecting right now. Please contact the administrator to check the API configuration.'
      }, { status: 500 });
    }

    // Connect to MongoDB database
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.warn('Database connection failed, proceeding without chat history:', dbError);
    }

    // Get user ID from session
    const userId = await getUserId(request) || 'anonymous';

    // Generate a new session ID if not provided
    const chatSessionId = sessionId || uuidv4();

    // Try to save user message to database
    try {
      await saveChatMessage(userId, {
        text: message,
        sender: 'user',
        timestamp: new Date(),
      }, chatSessionId);
    } catch (saveError) {
      console.warn('Failed to save chat message to database:', saveError);
    }

    // Initialize Gemini AI with proper system instruction
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      systemInstruction: systemPrompt,
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    };

    // Start a new chat session with proper history format
    const chatSession = model.startChat({
      generationConfig,
      history: [], // Start fresh - no pre-populated history
    });

    const result = await chatSession.sendMessage(message);
    const response = result.response.text();

    // Try to save bot response to database
    try {
      await saveChatMessage(userId, {
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      }, chatSessionId);
    } catch (saveError) {
      console.warn('Failed to save bot response to database:', saveError);
    }

    return NextResponse.json({ response, sessionId: chatSessionId });
  } catch (error: any) {
    console.error('Chat API Error:', error?.message || error);

    // Return a user-friendly error message
    const errorMessage = error?.message?.includes('API')
      ? 'There is an issue with the AI service configuration.'
      : 'I am having trouble processing your message right now. Please try again.';

    return NextResponse.json({
      error: errorMessage,
      response: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    }, { status: 500 });
  }
}