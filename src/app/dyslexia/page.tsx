'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DyslexiaTeacherBooking from './teacher-booking';

const DyslexiaResourcePage = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [fontStyle, setFontStyle] = useState<string>('font-sans');
  const [fontSize, setFontSize] = useState<string>('text-base');
  const [lineSpacing, setLineSpacing] = useState<string>('leading-normal');

  // Interactive content sections
  const sections = [
    {
      id: 'reading-tools',
      title: 'Reading Support Tools',
      description: 'Tools to make reading more accessible and enjoyable',
      content: (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Reading Enhancement Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-teal-200 p-4 rounded-lg hover:bg-teal-50 transition">
              <h4 className="font-medium text-teal-700">Text-to-Speech</h4>
              <p>Listen to text being read aloud with customizable voices</p>
              <button className="mt-2 bg-teal-600 text-white px-3 py-1 rounded-md text-sm">
                Try Now
              </button>
            </div>
            <div className="border border-teal-200 p-4 rounded-lg hover:bg-teal-50 transition">
              <h4 className="font-medium text-teal-700">Reading Ruler</h4>
              <p>Digital ruler to help focus on one line of text at a time</p>
              <button className="mt-2 bg-teal-600 text-white px-3 py-1 rounded-md text-sm">
                Activate
              </button>
            </div>
            <div className="border border-teal-200 p-4 rounded-lg hover:bg-teal-50 transition">
              <h4 className="font-medium text-teal-700">Color Overlays</h4>
              <p>Customize background colors to reduce visual stress</p>
              <button className="mt-2 bg-teal-600 text-white px-3 py-1 rounded-md text-sm">
                Customize
              </button>
            </div>
            <div className="border border-teal-200 p-4 rounded-lg hover:bg-teal-50 transition">
              <h4 className="font-medium text-teal-700">Syllable Highlighter</h4>
              <p>Break words into syllables for easier reading</p>
              <button className="mt-2 bg-teal-600 text-white px-3 py-1 rounded-md text-sm">
                Try Now
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'phonological-awareness',
      title: 'Phonological Awareness',
      description: 'Interactive activities to build sound-letter connections',
      content: (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Phonological Awareness Activities</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-700">Sound Blending</h4>
              <p className="mb-2">Practice combining sounds to form words:</p>
              <div className="flex flex-wrap gap-2">
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Beginner Level
                </button>
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Intermediate
                </button>
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Advanced
                </button>
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Challenge Mode
                </button>
              </div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-medium text-indigo-700">Rhyming Games</h4>
              <p className="mb-2">Fun activities to practice rhyming patterns:</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 p-2 rounded-lg text-sm flex items-center justify-center">
                  Rhyme Match
                </button>
                <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 p-2 rounded-lg text-sm flex items-center justify-center">
                  Rhyme Creation
                </button>
                <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 p-2 rounded-lg text-sm flex items-center justify-center">
                  Rhyme Stories
                </button>
                <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 p-2 rounded-lg text-sm flex items-center justify-center">
                  Rhyme Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'multisensory-learning',
      title: 'Multisensory Learning',
      description: 'Activities that engage multiple senses for better retention',
      content: (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Multisensory Learning Activities</h3>
          <p className="mb-4">
            Engage multiple senses to strengthen learning pathways:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-2 border-purple-300 rounded-lg p-4 hover:bg-purple-50 transition">
              <h4 className="font-medium text-purple-700 mb-2">Tactile Letter Formation</h4>
              <p className="text-gray-600 mb-3">
                Trace letters with your finger on different textures
              </p>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Visual</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Tactile</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Kinesthetic</span>
              </div>
              <button className="bg-purple-600 text-white px-4 py-1 rounded-md text-sm">
                Start Activity
              </button>
            </div>
            <div className="border-2 border-green-300 rounded-lg p-4 hover:bg-green-50 transition">
              <h4 className="font-medium text-green-700 mb-2">Sound-Symbol Association</h4>
              <p className="text-gray-600 mb-3">
                Connect letters with sounds through interactive games
              </p>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Visual</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Auditory</span>
              </div>
              <button className="bg-green-600 text-white px-4 py-1 rounded-md text-sm">
                Start Activity
              </button>
            </div>
            <div className="border-2 border-blue-300 rounded-lg p-4 hover:bg-blue-50 transition">
              <h4 className="font-medium text-blue-700 mb-2">Word Building Blocks</h4>
              <p className="text-gray-600 mb-3">
                Physically arrange letter blocks to build words
              </p>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Visual</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Tactile</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Kinesthetic</span>
              </div>
              <button className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm">
                Start Activity
              </button>
            </div>
            <div className="border-2 border-amber-300 rounded-lg p-4 hover:bg-amber-50 transition">
              <h4 className="font-medium text-amber-700 mb-2">Rhythm and Reading</h4>
              <p className="text-gray-600 mb-3">
                Use rhythm and music to improve reading fluency
              </p>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Auditory</span>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Kinesthetic</span>
              </div>
              <button className="bg-amber-600 text-white px-4 py-1 rounded-md text-sm">
                Start Activity
              </button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-b from-teal-50 to-blue-50 py-8 px-4 ${fontStyle} ${fontSize} ${lineSpacing}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-teal-800 mb-4">
            Interactive Learning for Dyslexia
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Personalized, accessible learning experiences designed to support reading, 
            writing, and language skills for individuals with dyslexia.
          </p>
        </div>

        {/* Text Customization Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold text-teal-800 mb-4">Customize Text Display</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-teal-700 mb-2">Font Style</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setFontStyle('font-sans')}
                  className={`px-3 py-1 rounded-md text-sm ${fontStyle === 'font-sans' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Sans-serif
                </button>
                <button 
                  onClick={() => setFontStyle('font-serif')}
                  className={`px-3 py-1 rounded-md text-sm ${fontStyle === 'font-serif' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Serif
                </button>
                <button 
                  onClick={() => setFontStyle('font-mono')}
                  className={`px-3 py-1 rounded-md text-sm ${fontStyle === 'font-mono' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Monospace
                </button>
                <button 
                  onClick={() => setFontStyle('dyslexic-font')}
                  className={`px-3 py-1 rounded-md text-sm ${fontStyle === 'dyslexic-font' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Dyslexic
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-teal-700 mb-2">Font Size</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setFontSize('text-sm')}
                  className={`px-3 py-1 rounded-md text-sm ${fontSize === 'text-sm' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Small
                </button>
                <button 
                  onClick={() => setFontSize('text-base')}
                  className={`px-3 py-1 rounded-md text-sm ${fontSize === 'text-base' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Medium
                </button>
                <button 
                  onClick={() => setFontSize('text-lg')}
                  className={`px-3 py-1 rounded-md text-sm ${fontSize === 'text-lg' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Large
                </button>
                <button 
                  onClick={() => setFontSize('text-xl')}
                  className={`px-3 py-1 rounded-md text-sm ${fontSize === 'text-xl' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Extra Large
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-teal-700 mb-2">Line Spacing</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setLineSpacing('leading-snug')}
                  className={`px-3 py-1 rounded-md text-sm ${lineSpacing === 'leading-snug' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Compact
                </button>
                <button 
                  onClick={() => setLineSpacing('leading-normal')}
                  className={`px-3 py-1 rounded-md text-sm ${lineSpacing === 'leading-normal' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Normal
                </button>
                <button 
                  onClick={() => setLineSpacing('leading-relaxed')}
                  className={`px-3 py-1 rounded-md text-sm ${lineSpacing === 'leading-relaxed' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Relaxed
                </button>
                <button 
                  onClick={() => setLineSpacing('leading-loose')}
                  className={`px-3 py-1 rounded-md text-sm ${lineSpacing === 'leading-loose' ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  Spacious
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Booking Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl p-6 mb-10 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Connect with Specialized Teachers</h2>
              <p className="mb-4 md:mb-0">
                Book one-on-one sessions with teachers experienced in dyslexia education
              </p>
            </div>
            <Link href="/teacher-booking/dyslexia" className="bg-white text-teal-700 hover:bg-teal-100 px-6 py-2 rounded-lg font-medium transition">
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
                <h2 className="text-xl font-semibold text-teal-700 mb-2">{section.title}</h2>
                <p className="text-gray-600">{section.description}</p>
                <div className="mt-4 flex justify-end">
                  <span className="text-teal-600 font-medium">
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

        {/* Reading Practice Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold text-teal-800 mb-4">Reading Practice</h2>
          <div className="bg-teal-50 p-4 rounded-lg mb-6">
            <p className="mb-4">
              Practice your reading with texts at different levels. Each text comes with 
              comprehension support and vocabulary help.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button className="bg-teal-100 hover:bg-teal-200 text-teal-800 p-2 rounded-lg transition">
                Beginner Texts
              </button>
              <button className="bg-teal-100 hover:bg-teal-200 text-teal-800 p-2 rounded-lg transition">
                Intermediate Texts
              </button>
              <button className="bg-teal-100 hover:bg-teal-200 text-teal-800 p-2 rounded-lg transition">
                Advanced Texts
              </button>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-teal-700 mb-3">Sample Text</h3>
            <p className="mb-4">
              The quick brown fox jumps over the lazy dog. This sentence contains every 
              letter in the English alphabet. It is often used to test typewriters and 
              computer fonts. The sentence is a pangram, which means it uses every letter 
              of the alphabet.
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Read Aloud
              </button>
              <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Highlight Syllables
              </button>
              <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Show Definitions
              </button>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold text-teal-800 mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <h3 className="font-medium text-teal-700 mb-2">Parent Guides</h3>
              <p className="text-gray-600 mb-3">Resources to help parents support learning at home</p>
              <button className="text-teal-600 font-medium">Learn more →</button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <h3 className="font-medium text-teal-700 mb-2">Educator Tools</h3>
              <p className="text-gray-600 mb-3">Specialized tools and strategies for teachers</p>
              <button className="text-teal-600 font-medium">Learn more →</button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <h3 className="font-medium text-teal-700 mb-2">Community Forum</h3>
              <p className="text-gray-600 mb-3">Connect with others in the dyslexia community</p>
              <button className="text-teal-600 font-medium">Join now →</button>
            </div>
          </div>
        </div>

        {/* Teacher Booking Section */}
        <div className="mb-8" id="teacher-booking">
          <h2 className="text-2xl font-bold text-teal-800 mb-6">Connect with Specialized Teachers</h2>
          <DyslexiaTeacherBooking />
        </div>

        {/* Feedback Section */}
        <div className="bg-teal-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-teal-800 mb-4">Help Us Improve</h2>
          <p className="text-gray-600 mb-4">
            We value your feedback to make our resources more effective and accessible.
          </p>
          <button className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-lg transition">
            Share Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default DyslexiaResourcePage; 
