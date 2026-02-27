'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define SpeechRecognition interfaces for TypeScript
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello there! 🌿 I'm so happy to see you. How are you feeling right now?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptText = result[0].transcript;

        setInputValue(transcriptText);

        if (result.isFinal) {
          setIsListening(false);
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
          setTimeout(() => {
            handleSendMessage(transcriptText);
          }, 100);
        }
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // Auto-scroll down
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Auto-resize input box
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const softVoice = voices.find(voice =>
        voice.name.includes('female') || voice.name.includes('Samantha') || voice.name.includes('Google US English')
      );

      if (softVoice) utterance.voice = softVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      setInputValue('');
    }
  };

  const handleSendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || inputValue.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      // 1. Format the history for Gemini directly in the client
      let formattedHistory: any[] = [];
      if (updatedMessages.length > 0) {
        formattedHistory = updatedMessages.map((msg) => ({
          role: msg.sender === 'bot' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        }));

        // Remove the current user prompt from the history array so we don't send it twice
        if (formattedHistory[formattedHistory.length - 1].role === 'user') {
          formattedHistory.pop();
        }
      }

      // 2. Initialize Gemini AI with Client-Side Key
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({
        model: 'gemini-pro',
        systemInstruction: `You are MindMitra, a highly empathetic, soothing, and gentle companion bot designed specifically for neurodivergent individuals (Autism, ADHD, Dyslexia). 
        
        Guidelines:
        1. Keep your responses short, clear, and easy to read.
        2. Be exceedingly patient, warm, and validating.
        3. After validating feelings, gently ask exactly ONE open-ended follow-up question to learn about their state of mind or hobbies.
        4. Avoid metaphors or sarcasm. Be literal.
        
        REPORT COMMAND: If the user says 'Caregiver command: Please generate a detailed progress report...', output a structured, bulleted report covering: Emotional State, Interests & Hobbies, Strengths Identified, and Potential Career/Path Suggestions.`
      });

      // 3. Send message to Gemini
      const chat = model.startChat({ history: formattedHistory });
      const result = await chat.sendMessage(textToSend);
      const responseText = result.response.text();

      // 4. Update UI with Bot Response
      const botMessage: Message = {
        text: responseText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      speakText(responseText);
      setIsTyping(false);

    } catch (error) {
      console.error('Gemini API Error:', error);
      const errorMessage: Message = {
        text: "I am having a little trouble connecting right now. Please give me a moment.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleGenerateReport = () => {
    handleSendMessage("Caregiver command: Please generate a detailed progress report based on our conversation today, including emotional state, identified hobbies, and potential career paths.");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-teal-500 text-white shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-leaf'} text-xl`}></i>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[550px] bg-stone-50 rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col border border-teal-100"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header Area */}
            <div className="bg-teal-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <i className="fas fa-seedling"></i>
                </div>
                <div>
                  <h3 className="font-semibold tracking-wide">MindMitra</h3>
                  <p className="text-xs opacity-90">Your gentle guide</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={handleGenerateReport} title="Generate Caregiver Report" className="text-teal-500 bg-white hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
                  <i className="fas fa-file-medical text-sm"></i>
                </button>
                <Link href="/dashboard/chatbot">
                  <button className="text-white bg-teal-600 hover:bg-teal-700 rounded-full w-8 h-8 flex items-center justify-center">
                    <i className="fas fa-expand-alt text-sm"></i>
                  </button>
                </Link>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-stone-50">
              {messages.map((msg, index) => (
                <div key={index} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${msg.sender === 'user'
                        ? 'bg-sky-100 text-slate-800 rounded-tr-sm shadow-sm'
                        : 'bg-white shadow-sm border border-gray-100 text-slate-700 rounded-tl-sm'
                      }`}
                  >
                    <p className="whitespace-pre-wrap text-[15px] font-medium">{msg.text}</p>
                    <span className={`text-[10px] block mt-2 ${msg.sender === 'user' ? 'text-slate-400' : 'text-gray-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex mb-4 justify-start">
                  <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-tl-sm p-4 max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-teal-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-teal-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-teal-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end bg-stone-50 rounded-xl border border-gray-200 p-1 focus-within:ring-2 focus-within:ring-teal-400 transition-all">
                <textarea
                  ref={inputRef}
                  className="flex-1 bg-transparent py-2 px-3 focus:outline-none resize-none max-h-32 min-h-[40px] text-slate-700 placeholder-slate-400"
                  placeholder="Type here..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <div className="flex pb-1 pr-1">
                  <button
                    className={`rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0 transition-colors ${isListening ? 'bg-rose-400 text-white' : 'text-slate-400 hover:bg-slate-200'
                      }`}
                    onClick={toggleListening}
                  >
                    <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                  </button>
                  <button
                    className="ml-1 bg-teal-500 hover:bg-teal-600 text-white rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0 transition-colors"
                    onClick={() => handleSendMessage()}
                  >
                    <i className="fas fa-paper-plane text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;