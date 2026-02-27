'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ADHDTeacherBooking from './teacher-booking';

const ADHDResourcePage = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Interactive content sections
  const sections = [
    {
      id: 'focus-tools',
      title: 'Focus & Attention Tools',
      description: 'Interactive tools to improve focus and attention span',
      content: (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Focus Enhancement Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-orange-200 p-4 rounded-lg hover:bg-orange-50 transition">
              <h4 className="font-medium text-orange-700">Pomodoro Timer</h4>
              <p>Customizable work/break intervals to maintain focus</p>
              <button className="mt-2 bg-orange-600 text-white px-3 py-1 rounded-md text-sm">
                Start Timer
              </button>
            </div>
            <div className="border border-orange-200 p-4 rounded-lg hover:bg-orange-50 transition">
              <h4 className="font-medium text-orange-700">Background Noise</h4>
              <p>Ambient sounds to help maintain focus during tasks</p>
              <button className="mt-2 bg-orange-600 text-white px-3 py-1 rounded-md text-sm">
                Play Sounds
              </button>
            </div>
            <div className="border border-orange-200 p-4 rounded-lg hover:bg-orange-50 transition">
              <h4 className="font-medium text-orange-700">Task Chunking</h4>
              <p>Break down complex tasks into manageable steps</p>
              <button className="mt-2 bg-orange-600 text-white px-3 py-1 rounded-md text-sm">
                Create Plan
              </button>
            </div>
            <div className="border border-orange-200 p-4 rounded-lg hover:bg-orange-50 transition">
              <h4 className="font-medium text-orange-700">Focus Metrics</h4>
              <p>Track your focus patterns and improvements</p>
              <button className="mt-2 bg-orange-600 text-white px-3 py-1 rounded-md text-sm">
                View Stats
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'executive-function',
      title: 'Executive Function Support',
      description: 'Tools for organization, planning, and time management',
      content: (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Executive Function Tools</h3>
          <div className="space-y-4">
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-medium text-teal-700">Organization Systems</h4>
              <p className="mb-2">Digital tools to help stay organized:</p>
              <div className="flex flex-wrap gap-2">
                <button className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-3 py-1 rounded-full text-sm">
                  Visual Planner
                </button>
                <button className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-3 py-1 rounded-full text-sm">
                  Task Manager
                </button>
                <button className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-3 py-1 rounded-full text-sm">
                  Calendar View
                </button>
                <button className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-3 py-1 rounded-full text-sm">
                  Reminder System
                </button>
              </div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-medium text-amber-700">Time Management</h4>
              <p className="mb-2">Tools to help with time awareness:</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded-lg text-sm flex items-center justify-center">
                  Visual Timer
                </button>
                <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded-lg text-sm flex items-center justify-center">
                  Time Estimator
                </button>
                <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded-lg text-sm flex items-center justify-center">
                  Schedule Builder
                </button>
                <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded-lg text-sm flex items-center justify-center">
                  Routine Creator
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'gamified-learning',
      title: 'Gamified Learning',
      description: 'Engaging, reward-based learning activities',
      content: (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Learning Through Games</h3>
          <p className="mb-4">
            Explore our gamified learning modules designed to maintain engagement:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-2 border-blue-300 rounded-lg p-4 hover:bg-blue-50 transition">
              <h4 className="font-medium text-blue-700 mb-2">Math Adventure</h4>
              <p className="text-gray-600 mb-3">
                Solve math problems to progress through an exciting story
              </p>
              <div className="flex items-center text-sm text-blue-600">
                <span className="mr-2">Difficulty:</span>
                <div className="flex space-x-1">
                  <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                  <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                  <span className="w-4 h-4 bg-blue-300 rounded-full"></span>
                  <span className="w-4 h-4 bg-blue-300 rounded-full"></span>
                  <span className="w-4 h-4 bg-blue-300 rounded-full"></span>
                </div>
              </div>
              <button className="mt-3 bg-blue-600 text-white px-4 py-1 rounded-md text-sm">
                Play Now
              </button>
            </div>
            <div className="border-2 border-green-300 rounded-lg p-4 hover:bg-green-50 transition">
              <h4 className="font-medium text-green-700 mb-2">Vocabulary Quest</h4>
              <p className="text-gray-600 mb-3">
                Build vocabulary through an interactive RPG experience
              </p>
              <div className="flex items-center text-sm text-green-600">
                <span className="mr-2">Difficulty:</span>
                <div className="flex space-x-1">
                  <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                  <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                  <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                  <span className="w-4 h-4 bg-green-300 rounded-full"></span>
                  <span className="w-4 h-4 bg-green-300 rounded-full"></span>
                </div>
              </div>
              <button className="mt-3 bg-green-600 text-white px-4 py-1 rounded-md text-sm">
                Play Now
              </button>
            </div>
            <div className="border-2 border-purple-300 rounded-lg p-4 hover:bg-purple-50 transition">
              <h4 className="font-medium text-purple-700 mb-2">Science Explorer</h4>
              <p className="text-gray-600 mb-3">
                Conduct virtual experiments to learn scientific concepts
              </p>
              <div className="flex items-center text-sm text-purple-600">
                <span className="mr-2">Difficulty:</span>
                <div className="flex space-x-1">
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span className="w-4 h-4 bg-purple-300 rounded-full"></span>
                </div>
              </div>
              <button className="mt-3 bg-purple-600 text-white px-4 py-1 rounded-md text-sm">
                Play Now
              </button>
            </div>
            <div className="border-2 border-red-300 rounded-lg p-4 hover:bg-red-50 transition">
              <h4 className="font-medium text-red-700 mb-2">History Time Machine</h4>
              <p className="text-gray-600 mb-3">
                Travel through time to experience historical events
              </p>
              <div className="flex items-center text-sm text-red-600">
                <span className="mr-2">Difficulty:</span>
                <div className="flex space-x-1">
                  <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                  <span className="w-4 h-4 bg-red-300 rounded-full"></span>
                  <span className="w-4 h-4 bg-red-300 rounded-full"></span>
                  <span className="w-4 h-4 bg-red-300 rounded-full"></span>
                  <span className="w-4 h-4 bg-red-300 rounded-full"></span>
                </div>
              </div>
              <button className="mt-3 bg-red-600 text-white px-4 py-1 rounded-md text-sm">
                Play Now
              </button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-800 mb-4">
            Interactive Learning for ADHD
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Engaging, adaptive learning experiences designed to support focus, organization, 
            and executive function for individuals with ADHD.
          </p>
        </div>

        {/* Interactive Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
              onClick={() => setSelectedSection(section.id === selectedSection ? null : section.id)}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-orange-700 mb-2">{section.title}</h2>
                <p className="text-gray-600">{section.description}</p>
                <div className="mt-4 flex justify-end">
                  <span className="text-orange-600 font-medium">
                    {selectedSection === section.id ? 'Close' : 'Explore'} ↓
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Section Content */}
        {selectedSection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-10"
          >
            {sections.find((section) => section.id === selectedSection)?.content}
          </motion.div>
        )}

        {/* Teacher Booking Section */}
        <div className="mb-8" id="teacher-booking">
          <h2 className="text-2xl font-bold text-orange-800 mb-6">Connect with Specialized Teachers</h2>
          <ADHDTeacherBooking />
        </div>

        {/* Movement Break Section */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl p-6 mb-10 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-3">Need a Movement Break?</h2>
          <p className="mb-4">
            Taking short movement breaks can help improve focus and attention. Try one of these quick activities:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <button className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition">
              <span className="block font-medium mb-1">Desk Exercises</span>
              <span className="text-sm">2 min</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition">
              <span className="block font-medium mb-1">Stretching Routine</span>
              <span className="text-sm">3 min</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition">
              <span className="block font-medium mb-1">Mindful Movement</span>
              <span className="text-sm">5 min</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition">
              <span className="block font-medium mb-1">Dance Break</span>
              <span className="text-sm">2 min</span>
            </button>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold text-orange-800 mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <h3 className="font-medium text-orange-700 mb-2">Parent Guides</h3>
              <p className="text-gray-600 mb-3">Resources to help parents support learning at home</p>
              <button className="text-orange-600 font-medium">Learn more →</button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <h3 className="font-medium text-orange-700 mb-2">Educator Tools</h3>
              <p className="text-gray-600 mb-3">Specialized tools and strategies for teachers</p>
              <button className="text-orange-600 font-medium">Learn more →</button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <h3 className="font-medium text-orange-700 mb-2">Community Forum</h3>
              <p className="text-gray-600 mb-3">Connect with others in the ADHD community</p>
              <button className="text-orange-600 font-medium">Join now →</button>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-orange-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-orange-800 mb-4">Help Us Improve</h2>
          <p className="text-gray-600 mb-4">
            We value your feedback to make our resources more effective and accessible.
          </p>
          <button className="bg-orange-600 text-white hover:bg-orange-700 px-4 py-2 rounded-lg transition">
            Share Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default ADHDResourcePage; 