'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AutismTeacherBooking from './teacher-booking';

const AutismResourcePage = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Interactive content sections
  const sections = [
    {
      id: 'visual-learning',
      title: 'Visual Learning Tools',
      description: 'Interactive visual supports and structured learning activities',
      content: (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Visual Learning Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-purple-200 p-4 rounded-lg hover:bg-purple-50 transition">
              <h4 className="font-medium text-purple-700">Visual Schedules</h4>
              <p>Interactive daily routines and predictable sequences</p>
              <button className="mt-2 bg-purple-600 text-white px-3 py-1 rounded-md text-sm">
                Explore
              </button>
            </div>
            <div className="border border-purple-200 p-4 rounded-lg hover:bg-purple-50 transition">
              <h4 className="font-medium text-purple-700">Social Stories</h4>
              <p>Visual narratives explaining social situations</p>
              <button className="mt-2 bg-purple-600 text-white px-3 py-1 rounded-md text-sm">
                Explore
              </button>
            </div>
            <div className="border border-purple-200 p-4 rounded-lg hover:bg-purple-50 transition">
              <h4 className="font-medium text-purple-700">Emotion Recognition</h4>
              <p>Interactive activities for identifying emotions</p>
              <button className="mt-2 bg-purple-600 text-white px-3 py-1 rounded-md text-sm">
                Explore
              </button>
            </div>
            <div className="border border-purple-200 p-4 rounded-lg hover:bg-purple-50 transition">
              <h4 className="font-medium text-purple-700">Visual Timers</h4>
              <p>Tools to help understand time and transitions</p>
              <button className="mt-2 bg-purple-600 text-white px-3 py-1 rounded-md text-sm">
                Explore
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sensory-tools',
      title: 'Sensory-Friendly Learning',
      description: 'Adjustable sensory experiences and calming activities',
      content: (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Sensory Learning Tools</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700">Sensory Preferences</h4>
              <p className="mb-2">Customize your learning environment:</p>
              <div className="flex flex-wrap gap-2">
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Reduce animations
                </button>
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Lower sound
                </button>
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                  High contrast
                </button>
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Reading mode
                </button>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-700">Calming Activities</h4>
              <p className="mb-2">Interactive tools to help with regulation:</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-green-100 hover:bg-green-200 text-green-800 p-2 rounded-lg text-sm flex items-center justify-center">
                  Breathing Exercise
                </button>
                <button className="bg-green-100 hover:bg-green-200 text-green-800 p-2 rounded-lg text-sm flex items-center justify-center">
                  Visual Stimming
                </button>
                <button className="bg-green-100 hover:bg-green-200 text-green-800 p-2 rounded-lg text-sm flex items-center justify-center">
                  Sound Machine
                </button>
                <button className="bg-green-100 hover:bg-green-200 text-green-800 p-2 rounded-lg text-sm flex items-center justify-center">
                  Fidget Tools
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'special-interests',
      title: 'Special Interest Integration',
      description: 'Personalize learning through special interests',
      content: (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Learning Through Special Interests</h3>
          <p className="mb-4">
            Select your interests to personalize your learning experience:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {['Space', 'Animals', 'Trains', 'Dinosaurs', 'Music', 'Art', 'Science', 'Technology', 'History', 'Nature', 'Sports', 'Vehicles'].map((interest) => (
              <button
                key={interest}
                className="border-2 border-indigo-300 hover:border-indigo-500 rounded-lg p-2 text-center hover:bg-indigo-50 transition"
              >
                {interest}
              </button>
            ))}
          </div>
          <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-medium text-indigo-700">How it works</h4>
            <p>
              When you select your interests, our system will customize examples,
              activities, and rewards to match what you love, making learning more
              engaging and meaningful.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'creative-expression',
      title: 'Creative & Art Therapy',
      description: 'Interactive painting and tracing activities for creative expression',
      content: (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Art & Painting</h3>
          <p className="mb-4">
            Express yourself in a calm, structured environment:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-2 border-pink-300 rounded-lg p-4 hover:bg-pink-50 transition">
              <h4 className="font-medium text-pink-700 mb-2">ArtFlow Studio</h4>
              <p className="text-gray-600 mb-3">
                A step-by-step painting game with calming feedback and guided tracing.
              </p>
              <div className="flex items-center text-sm text-pink-600">
                <span className="mr-2">Focus:</span>
                <div className="flex space-x-2">
                  <span className="bg-pink-100 px-2 py-0.5 rounded">Creativity</span>
                  <span className="bg-pink-100 px-2 py-0.5 rounded">Calm</span>
                </div>
              </div>
              <Link href="/games/autism/art.html" target="_blank">
                <button className="mt-3 bg-pink-600 text-white px-4 py-1 rounded-md text-sm">
                  Play ArtFlow
                </button>
              </Link>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-800 mb-4">
            Interactive Learning for Autism
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Personalized, adaptive learning experiences designed to support the unique
            strengths and learning styles of individuals with autism.
          </p>
        </div>

        {/* Teacher Booking Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-10 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Connect with Specialized Teachers</h2>
              <p className="mb-4 md:mb-0">
                Book one-on-one sessions with teachers experienced in autism education
              </p>
            </div>
            <Link href="/teacher-booking/autism" className="bg-white text-indigo-700 hover:bg-indigo-100 px-6 py-2 rounded-lg font-medium transition">
              Book a Teacher
            </Link>
          </div>
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
                <h2 className="text-xl font-semibold text-purple-700 mb-2">{section.title}</h2>
                <p className="text-gray-600">{section.description}</p>
                <div className="mt-4 flex justify-end">
                  <span className="text-purple-600 font-medium">
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

        {/* Interactive Games Section - Directly Visible */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10" id="games">
          <h2 className="text-2xl font-bold text-purple-800 mb-2">Interactive Games & Activities</h2>
          <p className="text-gray-600 mb-6">Explore our collection of specialized games designed to support various skills.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "ArtFlow Studio", desc: "Creative painting and tracing game", file: "art.html", icon: "🎨", color: "pink" },
              { title: "Emotion Regulation", desc: "Learn to manage and understand emotions", file: "emotion-regulation.html", icon: "🧘", color: "blue" },
              { title: "Facial Expressions", desc: "Match and identify facial expressions", file: "facial-expression-matcher.html", icon: "😊", color: "yellow" },
              { title: "Joint Attention", desc: "Train focus and shared attention", file: "joint-attention-training.html", icon: "👀", color: "purple" },
              { title: "Pattern Recognition", desc: "Identify and complete visual patterns", file: "pattern-recognition.html", icon: "🧩", color: "green" },
              { title: "Sensory Calibration", desc: "Calibrate and balance sensory inputs", file: "sensory-calibration.html", icon: "⚖️", color: "teal" },
              { title: "Sensory Detective", desc: "Find clues using sensory integration", file: "sensory-detective.html", icon: "🕵️", color: "orange" },
              { title: "Sensory Matching", desc: "Match different sensory inputs", file: "sensory-matching.html", icon: "🎴", color: "red" },
              { title: "Overload Manager", desc: "Practice managing sensory overload", file: "sensory-overload-manager.html", icon: "🛡️", color: "indigo" },
              { title: "Social Cues", desc: "Learn to interpret social cues", file: "social-cues-match.html", icon: "🤝", color: "cyan" },
              { title: "Social Scenarios", desc: "Navigate interactive social situations", file: "social-scenario.html", icon: "💬", color: "lime" },
              { title: "Story Sequencer", desc: "Order sequences in social stories", file: "social-story-sequencer.html", icon: "📖", color: "rose" },
              { title: "Visual Sequencing", desc: "Practice visual ordering and sequencing", file: "visual-sequencing.html", icon: "🔢", color: "fuchsia" },
            ].map((game) => (
              <div key={game.file} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition bg-gray-50 hover:bg-white flex flex-col h-full">
                <div className="text-3xl mb-3">{game.icon}</div>
                <h3 className="font-semibold text-lg text-gray-800 mb-1">{game.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{game.desc}</p>
                <Link href={`/games/autism/${game.file}`} target="_blank">
                  <button className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 rounded-md transition text-sm">
                    Play Game
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <h3 className="font-medium text-purple-700 mb-2">Parent Guides</h3>
              <p className="text-gray-600 mb-3">Resources to help parents support learning at home</p>
              <button className="text-purple-600 font-medium">Learn more →</button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <h3 className="font-medium text-purple-700 mb-2">Educator Tools</h3>
              <p className="text-gray-600 mb-3">Specialized tools and strategies for teachers</p>
              <button className="text-purple-600 font-medium">Learn more →</button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <h3 className="font-medium text-purple-700 mb-2">Community Forum</h3>
              <p className="text-gray-600 mb-3">Connect with others in the autism community</p>
              <button className="text-purple-600 font-medium">Join now →</button>
            </div>
          </div>
        </div>

        {/* Teacher Booking Section */}
        <div className="mb-8" id="teacher-booking">
          <h2 className="text-2xl font-bold text-purple-800 mb-6">Connect with Specialized Teachers</h2>
          <AutismTeacherBooking />
        </div>

        {/* Feedback Section */}
        <div className="bg-purple-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">Help Us Improve</h2>
          <p className="text-gray-600 mb-4">
            We value your feedback to make our resources more effective and accessible.
          </p>
          <button className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg transition">
            Share Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutismResourcePage; 
