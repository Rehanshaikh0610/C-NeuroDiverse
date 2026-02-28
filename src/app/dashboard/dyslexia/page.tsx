'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiUser, FiInfo, FiBookOpen, FiTarget, FiCoffee } from 'react-icons/fi';
import TeacherBookingIcon from '@/components/TeacherBookingIcon';

export default function DyslexiaPage() {
  const [userName, setUserName] = useState('');
  const [shapeGameActive, setShapeGameActive] = useState(false);
  const [letterReversalActive, setLetterReversalActive] = useState(false);
  const [wordScrambleActive, setWordScrambleActive] = useState(false);
  const [phonemeBlendingActive, setPhonemeBlendingActive] = useState(false);
  const [letterTrackingActive, setLetterTrackingActive] = useState(false);
  const [readingFluencyActive, setReadingFluencyActive] = useState(false);
  const [rhymingPairsActive, setRhymingPairsActive] = useState(false);
  const [soundBlendingActive, setSoundBlendingActive] = useState(false);
  const [syllableCounterActive, setSyllableCounterActive] = useState(false);
  const [visualDiscriminationActive, setVisualDiscriminationActive] = useState(false);
  const [wordBuildingBlocksActive, setWordBuildingBlocksActive] = useState(false);
  const [artFlowActive, setArtFlowActive] = useState(false);
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('games');

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setUserName(parsedData.name || 'User');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Check theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors">
              <FiArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">Dyslexia Resources</h1>
          </div>
          <div className="flex items-center">
            {/* Teacher Booking Icon */}
            <TeacherBookingIcon type="dyslexia" className="mr-4" />
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform duration-200"
            >
              <FiUser size={20} />
            </div>
            <span className="ml-2 font-medium">{userName}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-4 px-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6">
          <div className="flex overflow-x-auto space-x-4 pb-2">
            <button
              onClick={() => setActiveTab('games')}
              className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'games'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <FiTarget className="mr-2" />
              Games
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'about'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <FiInfo className="mr-2" />
              About Dyslexia
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'resources'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <FiBookOpen className="mr-2" />
              Resources
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'tips'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <FiCoffee className="mr-2" />
              Management Tips
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto py-2 px-4">
        {activeTab === 'games' && (
          <div className="space-y-8 animate-fadeIn">
            {/* ArtFlow Studio */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-pink-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400">ArtFlow Studio</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    A step-by-step painting game with calming feedback to express yourself creatively. Useful for exploring colors and visual arts in a relaxing environment.
                  </p>
                </div>
                <button
                  onClick={() => setArtFlowActive(!artFlowActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${artFlowActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {artFlowActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {artFlowActive && (
                <div
                  className="mt-4 border-2 border-pink-200 dark:border-pink-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="artflow-wrapper" className="w-full">
                    <iframe
                      src="/games/autism/art.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="ArtFlow Studio"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Shape Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-purple-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">Colours and Shape Game</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    This interactive game helps improve visual processing, pattern recognition, and reading skills - essential areas for individuals with dyslexia.
                  </p>
                </div>
                <button
                  onClick={() => setShapeGameActive(!shapeGameActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${shapeGameActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {shapeGameActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {shapeGameActive && (
                <div
                  className="mt-4 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="game-wrapper" className="w-full">
                    <iframe
                      src="/games/dyslexia/shape-game/index.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Colours and Shape Game"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Letter Reversal Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Letter Reversal Challenge</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Practice identifying and correcting commonly reversed letters like b/d and p/q to improve reading accuracy and fluency.
                  </p>
                </div>
                <button
                  onClick={() => setLetterReversalActive(!letterReversalActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${letterReversalActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {letterReversalActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {letterReversalActive && (
                <div
                  className="mt-4 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="letter-reversal-wrapper" className="w-full">
                    <iframe
                      src="/games/dyslexia/letter-reversal.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Letter Reversal Challenge"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Word Scramble Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-green-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400">Word Scramble Challenge</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Unscramble letters to form words, improving spelling skills, word recognition, and visual processing abilities.
                  </p>
                </div>
                <button
                  onClick={() => setWordScrambleActive(!wordScrambleActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${wordScrambleActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {wordScrambleActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {wordScrambleActive && (
                <div
                  className="mt-4 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="word-scramble-wrapper" className="w-full">
                    <iframe
                      src="/games/dyslexia/word-scramble.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Word Scramble Challenge"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Phoneme Blending Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-amber-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">Phoneme Blending Game</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Practice combining individual sounds to form words, a critical skill for reading development and phonological awareness.
                  </p>
                </div>
                <button
                  onClick={() => setPhonemeBlendingActive(!phonemeBlendingActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${phonemeBlendingActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {phonemeBlendingActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {phonemeBlendingActive && (
                <div
                  className="mt-4 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="phoneme-blending-wrapper" className="w-full">
                    <iframe
                      src="/games/dyslexia/phoneme-blending.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Phoneme Blending Game"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Letter Tracking Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-pink-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400">Letter Tracking Challenge</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Improve visual tracking skills essential for reading by following and identifying specific letters in text.
                  </p>
                </div>
                <button
                  onClick={() => setLetterTrackingActive(!letterTrackingActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${letterTrackingActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {letterTrackingActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {letterTrackingActive && (
                <div
                  className="mt-4 border-2 border-pink-200 dark:border-pink-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="letter-tracking-wrapper" className="w-full">
                    <iframe
                      src="/games/dyslexia/letter-tracking.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Letter Tracking Challenge"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Reading Fluency Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-cyan-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">Reading Fluency Builder</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Practice reading with proper speed, accuracy, and expression to build reading confidence and comprehension.
                  </p>
                </div>
                <button
                  onClick={() => setReadingFluencyActive(!readingFluencyActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${readingFluencyActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {readingFluencyActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {readingFluencyActive && (
                <div
                  className="mt-4 border-2 border-cyan-200 dark:border-cyan-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="reading-fluency-wrapper" className="w-full">
                    <iframe
                      src="/games/dyslexia/reading-fluency.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Reading Fluency Builder"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Rhyming Pairs Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-violet-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400">Rhyming Pairs Challenge</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Match words that rhyme to strengthen phonological awareness and sound pattern recognition.
                  </p>
                </div>
                <button
                  onClick={() => setRhymingPairsActive(!rhymingPairsActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${rhymingPairsActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {rhymingPairsActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {rhymingPairsActive && (
                <div
                  className="mt-4 border-2 border-violet-200 dark:border-violet-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="rhyming-pairs-wrapper" className="w-full">
                    <iframe
                      src="/games/dyslexia/rhyming-pairs.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Rhyming Pairs Challenge"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sound Blending Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-emerald-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400">Sound Blending Adventure</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Learn to blend individual sounds together to form complete words, a fundamental skill for reading development.
                  </p>
                </div>
                <button
                  onClick={() => setSoundBlendingActive(!soundBlendingActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${soundBlendingActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {soundBlendingActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {soundBlendingActive && (
                <div
                  className="mt-4 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="sound-blending-wrapper" className="w-full">
                    <iframe
                      src="/games/dyslexia/sound-blending.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Sound Blending Adventure"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Syllable Counter Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400">Syllable Counter Challenge</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Practice breaking words into syllables to improve reading accuracy and word recognition skills.
                  </p>
                </div>
                <button
                  onClick={() => setSyllableCounterActive(!syllableCounterActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${syllableCounterActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {syllableCounterActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {syllableCounterActive && (
                <div
                  className="mt-4 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="syllable-counter-wrapper" className="w-full">
                    <iframe
                      src="/games/dyslexia/syllable-counter.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Syllable Counter Challenge"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Visual Discrimination Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-indigo-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">Visual Discrimination Game</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Strengthen your ability to notice differences between similar visual patterns, letters, and symbols.
                  </p>
                </div>
                <button
                  onClick={() => setVisualDiscriminationActive(!visualDiscriminationActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${visualDiscriminationActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {visualDiscriminationActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {visualDiscriminationActive && (
                <div
                  className="mt-4 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="visual-discrimination-wrapper" className="w-full">
                    <iframe
                      src="/games/dyslexia/visual-discrimination.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Visual Discrimination Game"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Word Building Blocks Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-orange-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400">Word Building Blocks</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Build words by combining letter blocks, reinforcing spelling patterns and word formation skills.
                  </p>
                </div>
                <button
                  onClick={() => setWordBuildingBlocksActive(!wordBuildingBlocksActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${wordBuildingBlocksActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {wordBuildingBlocksActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {wordBuildingBlocksActive && (
                <div
                  className="mt-4 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="word-building-blocks-wrapper" className="w-full">
                    <iframe
                      src="/games/dyslexia/word-building-blocks.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Word Building Blocks"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-fadeIn"
          >
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">About Dyslexia</h2>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Dyslexia is a learning disorder characterized by difficulty reading due to problems identifying speech sounds and learning how they relate to letters and words. It affects areas of the brain that process language.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                People with dyslexia may benefit from various strategies including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                <li className="transition-transform hover:translate-x-1">Multisensory teaching approaches</li>
                <li className="transition-transform hover:translate-x-1">Phonological awareness training</li>
                <li className="transition-transform hover:translate-x-1">Structured literacy programs</li>
                <li className="transition-transform hover:translate-x-1">Assistive technology and text-to-speech tools</li>
                <li className="transition-transform hover:translate-x-1">Visual processing exercises</li>
                <li className="transition-transform hover:translate-x-1">Reading practice with appropriate materials</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                Our interactive games are designed to help improve various skills affected by dyslexia, including visual processing, phonological awareness, and reading fluency.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-fadeIn"
          >
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">Dyslexia Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://dyslexiaida.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center hover:scale-102"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                  <FiInfo size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-purple-700 dark:text-purple-300">International Dyslexia Association</h3>
                  <p className="text-purple-600 dark:text-purple-400 text-sm">Research, Resources, and Support</p>
                </div>
              </a>

              <a
                href="https://www.understood.org/en/learning-thinking-differences/child-learning-disabilities/dyslexia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center hover:scale-102"
              >
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                  <FiTarget size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-pink-700 dark:text-pink-300">Understood.org</h3>
                  <p className="text-pink-600 dark:text-pink-400 text-sm">Dyslexia Resources and Support</p>
                </div>
              </a>

              <a
                href="https://www.readingrockets.org/reading-topics/dyslexia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center hover:scale-102"
              >
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                  <FiBookOpen size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-indigo-700 dark:text-indigo-300">Reading Rockets</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 text-sm">Strategies for Teaching Reading</p>
                </div>
              </a>

              <a
                href="https://www.dyslexicadvantage.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center hover:scale-102"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                  <FiCoffee size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-blue-700 dark:text-blue-300">Dyslexic Advantage</h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">Strengths-Based Approach to Dyslexia</p>
                </div>
              </a>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-fadeIn"
          >
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">Dyslexia Management Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-5 rounded-xl shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-102"
              >
                <h3 className="font-bold text-lg mb-3 text-purple-700 dark:text-purple-300 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white mr-2">1</span>
                  Reading Strategies
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-purple-700 dark:text-purple-300">
                  <li className="transition-transform hover:translate-x-1">Use a ruler or bookmark to track lines of text</li>
                  <li className="transition-transform hover:translate-x-1">Try colored overlays or tinted glasses</li>
                  <li className="transition-transform hover:translate-x-1">Break reading into smaller, manageable chunks</li>
                  <li className="transition-transform hover:translate-x-1">Practice with audiobooks while following along with text</li>
                </ul>
              </div>

              <div
                className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 p-5 rounded-xl shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-102"
              >
                <h3 className="font-bold text-lg mb-3 text-pink-700 dark:text-pink-300 flex items-center">
                  <span className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white mr-2">2</span>
                  Technology Aids
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-pink-700 dark:text-pink-300">
                  <li className="transition-transform hover:translate-x-1">Use text-to-speech software for reading</li>
                  <li className="transition-transform hover:translate-x-1">Try speech-to-text for writing assignments</li>
                  <li className="transition-transform hover:translate-x-1">Use dyslexia-friendly fonts (OpenDyslexic, Lexie Readable)</li>
                  <li className="transition-transform hover:translate-x-1">Utilize spelling and grammar checkers</li>
                </ul>
              </div>

              <div
                className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 p-5 rounded-xl shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-102"
              >
                <h3 className="font-bold text-lg mb-3 text-indigo-700 dark:text-indigo-300 flex items-center">
                  <span className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-2">3</span>
                  Study Techniques
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-indigo-700 dark:text-indigo-300">
                  <li className="transition-transform hover:translate-x-1">Create mind maps and visual diagrams</li>
                  <li className="transition-transform hover:translate-x-1">Record lectures and listen to them later</li>
                  <li className="transition-transform hover:translate-x-1">Use multisensory learning approaches</li>
                  <li className="transition-transform hover:translate-x-1">Take frequent breaks during study sessions</li>
                </ul>
              </div>

              <div
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-5 rounded-xl shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-102"
              >
                <h3 className="font-bold text-lg mb-3 text-blue-700 dark:text-blue-300 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">4</span>
                  Self-Advocacy
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-blue-700 dark:text-blue-300">
                  <li className="transition-transform hover:translate-x-1">Learn about your rights and accommodations</li>
                  <li className="transition-transform hover:translate-x-1">Communicate your needs to teachers and employers</li>
                  <li className="transition-transform hover:translate-x-1">Connect with dyslexia support groups</li>
                  <li className="transition-transform hover:translate-x-1">Focus on your strengths and unique abilities</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
