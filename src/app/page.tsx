'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import { ArrowRightIcon, ChatBubbleLeftRightIcon, PhoneIcon, EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const { theme } = useTheme();
  const supportSectionRef = useRef<HTMLDivElement>(null);
  const feedbackFormRef = useRef<HTMLDivElement>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedbackForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Feedback submitted:', feedbackForm);
    setFeedbackSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackForm({
        name: '',
        email: '',
        message: ''
      });
    }, 3000);
  };

  const scrollToSupport = () => {
    supportSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToFeedback = () => {
    feedbackFormRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 transition-colors duration-300">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
            N
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            NeuroDiverse
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={scrollToSupport}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300"
          >
            Contact Us
          </button>
          <button 
            onClick={scrollToFeedback}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300"
          >
            Feedback
          </button>
          <ThemeToggle />
          <Link href="/login">
            <button className="bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 px-4 py-2 rounded-lg font-medium text-blue-800 dark:text-blue-200 transition-colors duration-300 shadow-md hover:shadow-lg">
              Login
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center w-full mb-20">
          <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100 leading-tight">
              Supporting <span className="text-blue-600 dark:text-blue-400">Neurodivergent</span> Minds
            </h2>
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300 leading-relaxed">
              A supportive platform designed specifically for individuals with autism, ADHD, and dyslexia. 
              Organize tasks, manage time, and access resources tailored to your unique needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                  Get Started
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </button>
              </Link>
              <Link href="/about">
                <button className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-200 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-purple-200 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
              
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      N
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">NeuroDiverse</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Your supportive companion</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Task Management</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Organize your day with visual schedules and reminders</p>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Resource Library</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Access specialized content for autism, ADHD, and dyslexia</p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Support Community</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Connect with others who understand your experiences</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Join thousands of users today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Community Section */}
        <div ref={supportSectionRef} id="support-community" className="w-full mb-20 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Support Community</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Our team is here to help you navigate your journey. Reach out to us anytime for support, guidance, or just to chat.
            </p>
          </div>
          
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 max-w-4xl mx-auto">
            <div className="p-1 bg-gradient-to-r from-green-400 to-teal-500"></div>
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-green-500" />
                    Contact Our Team
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-4">
                        <PhoneIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Ishita</p>
                        <p className="text-gray-600 dark:text-gray-400">9067110122</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-4">
                        <PhoneIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Ismaeel</p>
                        <p className="text-gray-600 dark:text-gray-400">8169347887</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-4">
                        <PhoneIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Rehan</p>
                        <p className="text-gray-600 dark:text-gray-400">8291057033</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div ref={feedbackFormRef} className="md:w-1/2 md:border-l md:border-gray-200 md:dark:border-gray-700 md:pl-8 scroll-mt-24">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                    <EnvelopeIcon className="h-6 w-6 mr-2 text-blue-500" />
                    Send Us Feedback
                  </h3>
                  
                  {feedbackSubmitted ? (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                      <p className="text-green-800 dark:text-green-300 font-medium">Thank you for your feedback!</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">We appreciate your input and will use it to improve our services.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={feedbackForm.name}
                          onChange={handleFeedbackChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                          placeholder="Your name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={feedbackForm.email}
                          onChange={handleFeedbackChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                          placeholder="your@email.com"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={feedbackForm.message}
                          onChange={handleFeedbackChange}
                          required
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                          placeholder="Your feedback or questions..."
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                      >
                        Send Feedback
                        <PaperAirplaneIcon className="h-5 w-5 ml-2" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">© 2023 NeuroDiverse. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
            <button 
              onClick={scrollToSupport}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
} 
