'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const TeacherBookingHub = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-300 mb-4">
            Teacher Booking Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connect with specialized teachers for personalized learning experiences tailored to different neurodivergent needs.
          </p>
        </div>

        {/* Main Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 shadow-xl"
          >
            <Link href="/dashboard/autism">
              <div className="h-64 flex flex-col items-center justify-center text-white cursor-pointer">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" x2="12" y1="19" y2="22"></line>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Autism Specialists</h2>
                <p className="text-center text-white/80">
                  Connect with teachers specialized in autism education and support
                </p>
                <button className="mt-4 bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition">
                  Find Teachers
                </button>
              </div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -10 }}
            className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-6 shadow-xl"
          >
            <Link href="/dashboard/adhd">
              <div className="h-64 flex flex-col items-center justify-center text-white cursor-pointer">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" x2="12" y1="8" y2="16"></line>
                    <line x1="8" x2="16" y1="12" y2="12"></line>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">ADHD Specialists</h2>
                <p className="text-center text-white/80">
                  Connect with teachers specialized in ADHD education and support
                </p>
                <button className="mt-4 bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition">
                  Find Teachers
                </button>
              </div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -10 }}
            className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-6 shadow-xl"
          >
            <Link href="/dashboard/dyslexia">
              <div className="h-64 flex flex-col items-center justify-center text-white cursor-pointer">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Dyslexia Specialists</h2>
                <p className="text-center text-white/80">
                  Connect with teachers specialized in dyslexia education and support
                </p>
                <button className="mt-4 bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition">
                  Find Teachers
                </button>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Additional Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">
            Why Book a Specialized Teacher?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-300">Personalized Approach</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our teachers understand the unique learning styles and needs of neurodivergent students.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-300">Specialized Techniques</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Access evidence-based teaching methods specifically designed for different neurodivergent profiles.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-300">Flexible Scheduling</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Book sessions at times that work best for you, with options for recurring appointments.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-6 text-center">
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">1</div>
              <h3 className="font-bold text-lg mb-2">Choose Specialist Type</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Select the type of specialist that matches your needs
              </p>
            </div>
            <div className="hidden md:block text-blue-500 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">2</div>
              <h3 className="font-bold text-lg mb-2">Browse Teachers</h3>
              <p className="text-gray-700 dark:text-gray-300">
                View profiles, expertise, and availability
              </p>
            </div>
            <div className="hidden md:block text-blue-500 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">3</div>
              <h3 className="font-bold text-lg mb-2">Book Session</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Select a time and confirm your booking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherBookingHub; 