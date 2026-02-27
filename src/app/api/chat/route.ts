import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { saveChatMessage } from '@/services/chatService';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/mongodb';

// Initialize OpenAI compatible client
const apiKey = process.env.GROQ_API_KEY || "";
const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://api.groq.com/openai/v1", // Restore Groq base URL
});

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
    const { message, sessionId, botName = "MindMitra" } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
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

    // System prompt for the chatbot
    const systemPrompt = `You are \${botName}, a highly empathetic, soothing, and gentle companion bot designed specifically for neurodivergent individuals (Autism, ADHD, Dyslexia).

Guidelines:
1. Always respond in the same language the user uses (Multilingual Support).
2. Keep your responses short, clear, and easy to read.
3. Be exceedingly patient, warm, positive, and validating. Always give genuine yet positive replies.
4. Always act as a supportive friend to boost their confidence.
5. After validating feelings, gently ask exactly ONE open-ended follow-up question to learn about their state of mind or hobbies.
6. Avoid metaphors or sarcasm. Be literal.
7. Use simple and relatable words.
8. Make the user feel comfortable, heard, and appreciated.

If after 3-4 exchanges you detect signs of conditions like Autism, ADHD, or Dyslexia, mention it sensitively and supportive.
REPORT COMMAND: If the user asks to generate a detailed progress report, output a structured, bulleted report covering: Emotional State, Interests & Hobbies, Strengths Identified, and Potential Career/Path Suggestions based on their chats.`;

    let responseText = "I encountered an issue generating a response.";
    try {
      const completion = await openai.chat.completions.create({
        model: "openai/gpt-oss-120b", // The user specifically requested this model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
      });

      responseText = completion.choices[0]?.message?.content || responseText;
    } catch (aiError: any) {
      console.error('AI Completion Error:', aiError?.message || aiError);
      // Fallback if the specific model fails (e.g., Groq rejecting the model name)
      // Let's try with a default Groq model if the first one fails
      try {
        const fallbackCompletion = await openai.chat.completions.create({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.7,
        });
        responseText = fallbackCompletion.choices[0]?.message?.content || responseText;
      } catch (fallbackError: any) {
        console.error('Fallback AI Completion Error:', fallbackError?.message || fallbackError);
        throw fallbackError;
      }
    }

    // Try to save bot response to database
    try {
      await saveChatMessage(userId, {
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      }, chatSessionId);
    } catch (saveError) {
      console.warn('Failed to save bot response to database:', saveError);
    }

    return NextResponse.json({ response: responseText, sessionId: chatSessionId });
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