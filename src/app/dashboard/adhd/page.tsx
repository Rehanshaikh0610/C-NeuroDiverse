'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiUser, FiInfo, FiBookOpen, FiTarget, FiCoffee } from 'react-icons/fi';
import TeacherBookingIcon from '@/components/TeacherBookingIcon';

export default function ADHDPage() {
  const [userName, setUserName] = useState('');
  const [oddOneOutActive, setOddOneOutActive] = useState(false);
  const [focusChallengeActive, setFocusChallengeActive] = useState(false);
  const [attentionSpotlightActive, setAttentionSpotlightActive] = useState(false);
  const [executiveFunctionActive, setExecutiveFunctionActive] = useState(false);
  const [focusFinderActive, setFocusFinderActive] = useState(false);
  const [impulseControlActive, setImpulseControlActive] = useState(false);
  const [stopSignalActive, setStopSignalActive] = useState(false);
  const [sustainedAttentionActive, setSustainedAttentionActive] = useState(false);
  const [timeManagementActive, setTimeManagementActive] = useState(false);
  const [workingMemoryActive, setWorkingMemoryActive] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
              <FiArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">ADHD Resources</h1>
          </div>
          <div className="flex items-center">
            {/* Teacher Booking Icon */}
            <TeacherBookingIcon type="adhd" className="mr-4" />
            <div 
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform duration-200"
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
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === 'games' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              } transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <FiTarget className="mr-2" />
              Games
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === 'about' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              } transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <FiInfo className="mr-2" />
              About ADHD
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === 'resources' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              } transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <FiBookOpen className="mr-2" />
              Resources
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`px-4 py-2 rounded-lg flex items-center ${
                activeTab === 'tips' 
                  ? 'bg-blue-600 text-white' 
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
            {/* Odd One Out Game */}
            <div 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Epic Odd One Out Marathon</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    This game helps improve attention to detail, visual discrimination, and processing speed - all important skills for individuals with ADHD.
                  </p>
                </div>
                <button 
                  onClick={() => setOddOneOutActive(!oddOneOutActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${
                    oddOneOutActive 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                  } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {oddOneOutActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>
              
              {oddOneOutActive && (
                <div 
                  className="mt-4 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="game-wrapper" className="w-full">
                    <iframe 
                      src="/games/adhd/odd-one-out.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Epic Odd One Out Marathon"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Focus Challenge Game */}
            <div 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-green-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400">ADHD Focus Challenge</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    This interactive game is designed to enhance focus, concentration, and cognitive flexibility - key areas for ADHD management.
                  </p>
                </div>
                <button 
                  onClick={() => setFocusChallengeActive(!focusChallengeActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${
                    focusChallengeActive 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700'
                  } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {focusChallengeActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>
              
              {focusChallengeActive && (
                <div 
                  className="mt-4 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="new-game-wrapper" className="w-full">
                    <iframe 
                      src="/games/adhd/new-game/index.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="ADHD Focus Challenge"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Attention Spotlight Game */}
            <div 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-purple-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Attention Spotlight</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Train your ability to focus on specific stimuli while filtering out distractions, a critical skill for ADHD management.
                  </p>
                </div>
                <button 
                  onClick={() => setAttentionSpotlightActive(!attentionSpotlightActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${
                    attentionSpotlightActive 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
                  } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {attentionSpotlightActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>
              
              {attentionSpotlightActive && (
                <div 
                  className="mt-4 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="attention-spotlight-wrapper" className="w-full">
                    <iframe 
                      src="/games/adhd/attention-spotlight.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Attention Spotlight"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Executive Function Planner Game */}
            <div 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-pink-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400">Executive Function Planner</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Practice planning, organizing, and prioritizing tasks to strengthen executive function skills often challenged by ADHD.
                  </p>
                </div>
                <button 
                  onClick={() => setExecutiveFunctionActive(!executiveFunctionActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${
                    executiveFunctionActive 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700'
                  } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {executiveFunctionActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>
              
              {executiveFunctionActive && (
                <div 
                  className="mt-4 border-2 border-pink-200 dark:border-pink-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="executive-function-wrapper" className="w-full">
                    <iframe 
                      src="/games/adhd/executive-function-planner.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Executive Function Planner"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Focus Finder Game */}
            <div 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-cyan-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">Focus Finder</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Enhance your ability to maintain focus on a specific task while ignoring distractions in this engaging challenge.
                  </p>
                </div>
                <button 
                  onClick={() => setFocusFinderActive(!focusFinderActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${
                    focusFinderActive 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
                  } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {focusFinderActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>
              
              {focusFinderActive && (
                <div 
                  className="mt-4 border-2 border-cyan-200 dark:border-cyan-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="focus-finder-wrapper" className="w-full">
                    <iframe 
                      src="/games/adhd/focus-finder.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Focus Finder"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Impulse Control Game */}
            <div 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-amber-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">Impulse Control Challenge</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Practice restraining impulsive responses and making thoughtful decisions in various scenarios.
                  </p>
                </div>
                <button 
                  onClick={() => setImpulseControlActive(!impulseControlActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${
                    impulseControlActive 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
                  } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {impulseControlActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>
              
              {impulseControlActive && (
                <div 
                  className="mt-4 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="impulse-control-wrapper" className="w-full">
                    <iframe 
                      src="/games/adhd/impulse-control.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Impulse Control Challenge"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Stop Signal Game */}
            <div 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-red-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400">Stop Signal Game</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Improve your ability to stop an action that's already in progress, a key skill for impulse control.
                  </p>
                </div>
                <button 
                  onClick={() => setStopSignalActive(!stopSignalActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${
                    stopSignalActive 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                  } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {stopSignalActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>
              
              {stopSignalActive && (
                <div 
                  className="mt-4 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="stop-signal-wrapper" className="w-full">
                    <iframe 
                      src="/games/adhd/stop-signal.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Stop Signal Game"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sustained Attention Game */}
            <div 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-indigo-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Sustained Attention Challenge</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Build your ability to maintain focus over extended periods with this engaging attention training game.
                  </p>
                </div>
                <button 
                  onClick={() => setSustainedAttentionActive(!sustainedAttentionActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${
                    sustainedAttentionActive 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700'
                  } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {sustainedAttentionActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>
              
              {sustainedAttentionActive && (
                <div 
                  className="mt-4 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="sustained-attention-wrapper" className="w-full">
                    <iframe 
                      src="/games/adhd/sustained-attention.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Sustained Attention Challenge"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Time Management Game */}
            <div 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-teal-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">Time Management Master</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Develop effective time management skills through interactive scenarios and challenges.
                  </p>
                </div>
                <button 
                  onClick={() => setTimeManagementActive(!timeManagementActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${
                    timeManagementActive 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700'
                  } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {timeManagementActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>
              
              {timeManagementActive && (
                <div 
                  className="mt-4 border-2 border-teal-200 dark:border-teal-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="time-management-wrapper" className="w-full">
                    <iframe 
                      src="/games/adhd/time-management.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Time Management Master"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Working Memory Game */}
            <div 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-fuchsia-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-purple-600 dark:from-fuchsia-400 dark:to-purple-400">Working Memory Match</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Strengthen your working memory capacity with this engaging memory matching challenge.
                  </p>
                </div>
                <button 
                  onClick={() => setWorkingMemoryActive(!workingMemoryActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${
                    workingMemoryActive 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700'
                  } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {workingMemoryActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>
              
              {workingMemoryActive && (
                <div 
                  className="mt-4 border-2 border-fuchsia-200 dark:border-fuchsia-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="working-memory-wrapper" className="w-full">
                    <iframe 
                      src="/games/adhd/working-memory-match.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Working Memory Match"
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
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">About ADHD</h2>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Attention-deficit/hyperactivity disorder (ADHD) is a neurodevelopmental disorder characterized by patterns of inattention, hyperactivity, and impulsivity that can interfere with functioning or development.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                People with ADHD may benefit from various strategies including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                <li className="transition-transform hover:translate-x-1">Structured routines and organization systems</li>
                <li className="transition-transform hover:translate-x-1">Breaking tasks into smaller, manageable steps</li>
                <li className="transition-transform hover:translate-x-1">Regular physical activity</li>
                <li className="transition-transform hover:translate-x-1">Mindfulness and meditation practices</li>
                <li className="transition-transform hover:translate-x-1">Cognitive training exercises</li>
                <li className="transition-transform hover:translate-x-1">Proper sleep, nutrition, and exercise</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                Games like "Epic Odd One Out Marathon" can help improve attention, focus, and visual processing skills in a fun and engaging way.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-fadeIn"
          >
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">ADHD Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center hover:scale-102"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                  <FiInfo size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-blue-700 dark:text-blue-300">National Institute of Mental Health</h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">ADHD Information and Research</p>
                </div>
              </a>
              
              <a 
                href="https://chadd.org/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center hover:scale-102"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                  <FiTarget size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-green-700 dark:text-green-300">CHADD</h3>
                  <p className="text-green-600 dark:text-green-400 text-sm">Children and Adults with ADHD</p>
                </div>
              </a>
              
              <a 
                href="https://www.additudemag.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center hover:scale-102"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                  <FiBookOpen size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-purple-700 dark:text-purple-300">ADDitude Magazine</h3>
                  <p className="text-purple-600 dark:text-purple-400 text-sm">ADHD Strategies and Support</p>
                </div>
              </a>
              
              <a 
                href="https://www.understood.org/en/learning-thinking-differences/child-learning-disabilities/add-adhd" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center hover:scale-102"
              >
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                  <FiCoffee size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-orange-700 dark:text-orange-300">Understood.org</h3>
                  <p className="text-orange-600 dark:text-orange-400 text-sm">ADHD Resources and Support</p>
                </div>
              </a>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-fadeIn"
          >
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">ADHD Management Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-5 rounded-xl shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-102"
              >
                <h3 className="font-bold text-lg mb-3 text-blue-700 dark:text-blue-300 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">1</span>
                  Daily Routines
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-blue-700 dark:text-blue-300">
                  <li className="transition-transform hover:translate-x-1">Create consistent morning and evening routines</li>
                  <li className="transition-transform hover:translate-x-1">Use visual schedules and checklists</li>
                  <li className="transition-transform hover:translate-x-1">Set reminders for important tasks</li>
                  <li className="transition-transform hover:translate-x-1">Break large tasks into smaller steps</li>
                </ul>
              </div>
              
              <div 
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-5 rounded-xl shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-102"
              >
                <h3 className="font-bold text-lg mb-3 text-green-700 dark:text-green-300 flex items-center">
                  <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-2">2</span>
                  Environment Setup
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-green-700 dark:text-green-300">
                  <li className="transition-transform hover:translate-x-1">Minimize distractions in your workspace</li>
                  <li className="transition-transform hover:translate-x-1">Use noise-cancelling headphones if needed</li>
                  <li className="transition-transform hover:translate-x-1">Organize supplies and materials</li>
                  <li className="transition-transform hover:translate-x-1">Create designated spaces for different activities</li>
                </ul>
              </div>
              
              <div 
                className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-5 rounded-xl shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-102"
              >
                <h3 className="font-bold text-lg mb-3 text-purple-700 dark:text-purple-300 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white mr-2">3</span>
                  Focus Techniques
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-purple-700 dark:text-purple-300">
                  <li className="transition-transform hover:translate-x-1">Try the Pomodoro technique (25 min work, 5 min break)</li>
                  <li className="transition-transform hover:translate-x-1">Use body doubling (working alongside someone else)</li>
                  <li className="transition-transform hover:translate-x-1">Practice mindfulness meditation</li>
                  <li className="transition-transform hover:translate-x-1">Use fidget tools to help with focus</li>
                </ul>
              </div>
              
              <div 
                className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-5 rounded-xl shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-102"
              >
                <h3 className="font-bold text-lg mb-3 text-amber-700 dark:text-amber-300 flex items-center">
                  <span className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white mr-2">4</span>
                  Self-Care
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-amber-700 dark:text-amber-300">
                  <li className="transition-transform hover:translate-x-1">Prioritize regular sleep schedules</li>
                  <li className="transition-transform hover:translate-x-1">Exercise regularly to help manage symptoms</li>
                  <li className="transition-transform hover:translate-x-1">Eat balanced meals and stay hydrated</li>
                  <li className="transition-transform hover:translate-x-1">Take breaks when feeling overwhelmed</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
