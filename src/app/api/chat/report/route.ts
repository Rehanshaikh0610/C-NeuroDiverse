import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import connectToDatabase from '@/lib/mongodb';
import ChatMessage from '@/models/ChatMessage';
import mongoose from 'mongoose';

const apiKey = process.env.GROQ_API_KEY || "";
const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.groq.com/openai/v1",
});

async function getUserId(req: NextRequest) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return null;
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.id;
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { type } = await request.json(); // daily, weekly, monthly, average
        if (!['daily', 'weekly', 'monthly', 'average'].includes(type)) {
            return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
        }

        await connectToDatabase();

        // In actual implementation here, we shouldn't necessarily fail if user ID is missing since it might be anonymous 
        // but reports are usually tied to users. We'll fallback to a generic or throw error.
        const userId = await getUserId(request);

        // We should filter chats by date
        const now = new Date();
        let startDate = new Date();
        if (type === 'daily') {
            startDate.setHours(0, 0, 0, 0); // start of today
        } else if (type === 'weekly') {
            startDate.setDate(now.getDate() - 7);
        } else if (type === 'monthly') {
            startDate.setMonth(now.getMonth() - 1);
        } else if (type === 'average') {
            startDate.setFullYear(now.getFullYear() - 1); // up to a year ago
        }

        let filter: any = { timestamp: { $gte: startDate } };
        if (userId) filter.userId = new mongoose.Types.ObjectId(userId);

        // Fetch messages
        const messages = await ChatMessage.find(filter).sort({ timestamp: 1 }).limit(100);

        if (messages.length === 0) {
            return NextResponse.json({ error: 'No interactions found for this period to generate a report.' }, { status: 404 });
        }

        // Format messages
        const chatTranscript = messages.map(msg => `[\${msg.timestamp.toLocaleString()}] \${msg.sender}: \${msg.text}`).join('\n');
        let truncatedTranscript = chatTranscript;
        if (chatTranscript.length > 30000) {
            truncatedTranscript = chatTranscript.substring(0, 30000) + '\n... (truncated for length)';
        }

        const systemPrompt = `You are an expert psychological and behavioral analyst evaluating interactions of a neurodiverse individual (who may have Autism, ADHD, or Dyslexia) with a support chatbot.
Based on the transcript provided, generate a detailed progress report. The report must be structured with the following bullet points and sections:

## Comprehensive Report (\${type.toUpperCase()})
1. Emotional State & Mood Variations
2. Interests, Hobbies & Engaging Subjects
3. Strengths Identified (cognitive, social, or emotional)
4. Potential Recommendations or Career/Path Suggestions

Use a professional, incredibly positive, validating, and empathetic tone. Never diagnose. Provide a comprehensive analysis based ONLY on the transcript provided below.

TRANSCRIPT:
\${truncatedTranscript}`;

        let reportText = "Could not generate report.";

        try {
            const completion = await openai.chat.completions.create({
                model: "openai/gpt-oss-120b",
                messages: [{ role: "user", content: systemPrompt }],
                temperature: 0.5,
            });
            reportText = completion.choices[0]?.message?.content || reportText;
        } catch (err) {
            console.warn("Retrying with fallback model for report generation...", err);
            const fallbackCompletion = await openai.chat.completions.create({
                model: "llama3-70b-8192",
                messages: [{ role: "user", content: systemPrompt }],
                temperature: 0.5,
            });
            reportText = fallbackCompletion.choices[0]?.message?.content || reportText;
        }

        return NextResponse.json({ report: reportText });
    } catch (error: any) {
        console.error('Report API Error:', error?.message || error);
        return NextResponse.json({
            error: 'I am having trouble generating the report right now. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error?.message : undefined
        }, { status: 500 });
    }
}
