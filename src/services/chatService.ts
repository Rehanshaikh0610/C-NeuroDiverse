import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/mongodb';
import ChatMessage from '@/models/ChatMessage';
import UserProgress from '@/models/UserProgress';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: string | Date;
}

export async function saveChatMessage(userId: string, message: Message, sessionId?: string) {
  try {
    await connectToDatabase();
    
    // If no sessionId is provided, create a new one
    const chatSessionId = sessionId || uuidv4();
    
    // Create a new chat message
    const chatMessage = await ChatMessage.create({
      userId,
      text: message.text,
      sender: message.sender,
      timestamp: new Date(message.timestamp),
      sessionId: chatSessionId,
    });
    
    // If this is a user message, update user progress
    if (message.sender === 'user') {
      const userProgress = await UserProgress.findOne({ userId });
      if (userProgress) {
        userProgress.addPoints(2, 'chat_interaction', 'Chatbot interaction');
        await userProgress.save();
      }
    }
    
    return { chatMessage, sessionId: chatSessionId };
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
}

export async function getChatHistory(userId: string, sessionId: string, limit = 50) {
  try {
    await connectToDatabase();
    
    const messages = await ChatMessage.find({ userId, sessionId })
      .sort({ timestamp: 1 })
      .limit(limit);
    
    return messages.map(msg => ({
      text: msg.text,
      sender: msg.sender,
      timestamp: msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
}

export async function getUserChatSessions(userId: string) {
  try {
    await connectToDatabase();
    
    // Get distinct session IDs for the user
    const sessions = await ChatMessage.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$sessionId', lastMessage: { $max: '$timestamp' } } },
      { $sort: { lastMessage: -1 } },
      { $limit: 10 }
    ]);
    
    // For each session, get the first message to use as a title
    const sessionsWithDetails = await Promise.all(sessions.map(async (session) => {
      const firstMessage = await ChatMessage.findOne(
        { userId, sessionId: session._id },
        { text: 1, timestamp: 1 }
      ).sort({ timestamp: 1 });
      
      return {
        sessionId: session._id,
        title: firstMessage?.text.substring(0, 30) + '...' || 'Chat session',
        lastActive: session.lastMessage,
      };
    }));
    
    return sessionsWithDetails;
  } catch (error) {
    console.error('Error fetching user chat sessions:', error);
    throw error;
  }
}