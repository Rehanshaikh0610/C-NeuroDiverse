'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import jsPDF from 'jspdf';

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
  const [botName, setBotName] = useState('MindMitra');
  const [botIcon, setBotIcon] = useState('fa-seedling');
  const [view, setView] = useState<'chat' | 'settings' | 'report'>('chat');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Set initial welcome message dynamically based on botName
    setMessages([{
      text: `Hello there! I'm \${botName}. I'm so happy to see you. How are you feeling right now?`,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  }, [botName]);

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

  useEffect(() => {
    if (messagesEndRef.current && view === 'chat') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, view]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `\${inputRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    if (isOpen && view === 'chat' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, view]);

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

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: textToSend, botName })
      });

      const data = await response.json();

      if (data.response) {
        const botMessage: Message = {
          text: data.response,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessage]);
        speakText(data.response);
      } else if (data.error) {
        const errorMessage: Message = {
          text: `Sorry, I encountered an error: \${data.error}`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMessage]);
      }
      setIsTyping(false);

    } catch (error) {
      console.error('Chat API Error:', error);
      const errorMessage: Message = {
        text: "I am having a little trouble connecting right now. Please give me a moment.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const generatePDFReport = async (type: string) => {
    setIsGeneratingReport(true);
    try {
      const response = await fetch('/api/chat/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      const data = await response.json();

      if (data.report) {
        const doc = new jsPDF();
        const margin = 15;
        let verticalOffset = margin;

        doc.setFontSize(20);
        doc.text(`\${botName} - \${type.charAt(0).toUpperCase() + type.slice(1)} Report`, margin, verticalOffset);
        verticalOffset += 12;

        doc.setFontSize(11);
        const lines = doc.splitTextToSize(data.report, 180);

        for (let i = 0; i < lines.length; i++) {
          if (verticalOffset > 280) {
            doc.addPage();
            verticalOffset = margin;
          }
          doc.text(lines[i], margin, verticalOffset);
          verticalOffset += 6;
        }

        doc.save(`\${botName.toLowerCase()}_\${type}_report.pdf`);

        const msg: Message = {
          text: `I've successfully generated and downloaded the \${type} report for you! 📄 Please check your downloads folder.`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, msg]);
        setView('chat');
      } else {
        alert(`Error: \${data.error}`);
      }
    } catch (err) {
      console.error("Report generation failed:", err);
      alert("Something went wrong while generating the report.");
    }
    setIsGeneratingReport(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const iconOptions = [
    'fa-seedling', 'fa-robot', 'fa-cat', 'fa-dog', 'fa-star',
    'fa-heart', 'fa-sun', 'fa-moon', 'fa-leaf', 'fa-user-astronaut'
  ];

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-teal-500 text-white shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fas \${isOpen ? 'fa-times' : botIcon} text-xl`}></i>
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
            <div className="bg-teal-500 text-white p-4 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <i className={`fas \${botIcon}`}></i>
                </div>
                <div>
                  <h3 className="font-semibold tracking-wide">{botName}</h3>
                  <p className="text-xs opacity-90">Your gentle guide</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setView(view === 'settings' ? 'chat' : 'settings')}
                  title="Edit Bot"
                  className={`\${view === 'settings' ? 'bg-white text-teal-500' : 'text-white hover:bg-teal-600'} rounded-full w-8 h-8 flex items-center justify-center transition-colors`}
                >
                  <i className="fas fa-edit text-sm"></i>
                </button>
                <button
                  onClick={() => setView(view === 'report' ? 'chat' : 'report')}
                  title="Generate Caregiver Report"
                  className={`\${view === 'report' ? 'bg-white text-teal-500' : 'text-white hover:bg-teal-600'} rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-colors`}
                >
                  <i className="fas fa-file-pdf text-sm"></i>
                </button>
                <Link href="/dashboard/chatbot">
                  <button className="text-white hover:bg-teal-600 rounded-full w-8 h-8 flex items-center justify-center">
                    <i className="fas fa-expand-alt text-sm"></i>
                  </button>
                </Link>
              </div>
            </div>

            {/* View: Settings */}
            {view === 'settings' && (
              <div className="flex-1 p-6 bg-white overflow-y-auto">
                <h2 className="text-xl font-bold text-teal-800 mb-6 border-b border-teal-100 pb-2">Bot Settings</h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Friend's Name</label>
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="E.g., Leo, Sarah..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Give your companion a friendly name!</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose an Icon</label>
                  <div className="grid grid-cols-5 gap-3">
                    {iconOptions.map(icon => (
                      <button
                        key={icon}
                        onClick={() => setBotIcon(icon)}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl text-xl \${botIcon === icon ? 'bg-teal-500 text-white shadow-md transform scale-105' : 'bg-gray-100 text-gray-500 hover:bg-teal-100'}`}
                      >
                        <i className={`fas \${icon}`}></i>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setView('chat')}
                  className="w-full bg-teal-500 text-white font-medium py-2 rounded-lg hover:bg-teal-600 transition-colors shadow-sm"
                >
                  Save & Return to Chat
                </button>
              </div>
            )}

            {/* View: Reports */}
            {view === 'report' && (
              <div className="flex-1 p-6 bg-white overflow-y-auto">
                <h2 className="text-xl font-bold text-teal-800 mb-6 border-b border-teal-100 pb-2">Analysis Reports</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Generate a comprehensive, AI-powered PDF report analyzing the chat history to reflect on emotional states, identify strengths, and uncover potential career paths.
                </p>

                <div className="space-y-4">
                  {['daily', 'weekly', 'monthly', 'average'].map((type) => (
                    <button
                      key={type}
                      disabled={isGeneratingReport}
                      onClick={() => generatePDFReport(type)}
                      className="w-full flex items-center justify-between p-4 border border-teal-200 rounded-xl hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors disabled:opacity-50"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mr-3">
                          <i className={`fas fa-calendar-\${type === 'daily' ? 'day' : type === 'weekly' ? 'week' : type === 'monthly' ? 'alt' : 'check'}`}></i>
                        </div>
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-800 capitalize">{type} Report</h4>
                          <p className="text-xs text-gray-500">Download {type} progress</p>
                        </div>
                      </div>
                      <i className="fas fa-download text-teal-400"></i>
                    </button>
                  ))}
                </div>

                {isGeneratingReport && (
                  <div className="mt-6 flex flex-col items-center justify-center py-4 bg-teal-50 rounded-xl border border-teal-100">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mb-3"></div>
                    <p className="text-sm text-teal-700 font-medium">Analyzing chats & generating PDF...</p>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    onClick={() => setView('chat')}
                    className="text-sm text-teal-500 hover:text-teal-700 w-full text-center"
                  >
                    Back to Chat
                  </button>
                </div>
              </div>
            )}

            {/* Messages Area */}
            {view === 'chat' && (
              <>
                <div className="flex-1 p-4 overflow-y-auto bg-stone-50">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex mb-4 \${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 leading-relaxed \${msg.sender === 'user'
                            ? 'bg-sky-100 text-slate-800 rounded-tr-sm shadow-sm'
                            : 'bg-white shadow-sm border border-gray-100 text-slate-700 rounded-tl-sm'
                          }`}
                      >
                        <p className="whitespace-pre-wrap text-[15px] font-medium">{msg.text}</p>
                        <span className={`text-[10px] block mt-2 \${msg.sender === 'user' ? 'text-slate-400' : 'text-gray-400'}`}>
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
                        className={`rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0 transition-colors \${isListening ? 'bg-rose-400 text-white' : 'text-slate-400 hover:bg-slate-200'
                          }`}
                        onClick={toggleListening}
                      >
                        <i className={`fas \${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;