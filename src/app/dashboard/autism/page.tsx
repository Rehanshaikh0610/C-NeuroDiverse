'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiUser, FiInfo, FiBookOpen, FiTarget, FiCoffee } from 'react-icons/fi';
import TeacherBookingIcon from '@/components/TeacherBookingIcon';

export default function AutismPage() {
  const [userName, setUserName] = useState('User');
  const [sensoryCalibrationActive, setSensoryCalibrationActive] = useState(false);
  const [sensoryMatchingActive, setSensoryMatchingActive] = useState(false);
  const [facialExpressionActive, setFacialExpressionActive] = useState(false);
  const [socialScenarioActive, setSocialScenarioActive] = useState(false);
  const [socialStoryActive, setSocialStoryActive] = useState(false);
  const [socialCuesActive, setSocialCuesActive] = useState(false);
  const [emotionRegulationActive, setEmotionRegulationActive] = useState(false);
  const [sensoryDetectiveActive, setSensoryDetectiveActive] = useState(false);
  const [sensoryOverloadActive, setSensoryOverloadActive] = useState(false);
  const [sensoryProcessingActive, setSensoryProcessingActive] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
              <FiArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Autism Resources</h1>
          </div>
          <div className="flex items-center">
            {/* Teacher Booking Icon */}
            <TeacherBookingIcon type="autism" className="mr-4" />
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform duration-200"
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
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <FiTarget className="mr-2" />
              Games
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'about'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <FiInfo className="mr-2" />
              About Autism
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'resources'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <FiBookOpen className="mr-2" />
              Resources
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'tips'
                  ? 'bg-indigo-600 text-white'
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
                    A step-by-step painting game with calming feedback to express yourself creatively.
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

            {/* Sensory Calibration Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-indigo-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Sensory Calibration Challenge</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Adjust sensory inputs to comfortable levels and select appropriate coping strategies for various sensory challenges.
                  </p>
                </div>
                <button
                  onClick={() => setSensoryCalibrationActive(!sensoryCalibrationActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${sensoryCalibrationActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {sensoryCalibrationActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {sensoryCalibrationActive && (
                <div
                  className="mt-4 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="sensory-calibration-wrapper" className="w-full">
                    <iframe
                      src="/games/autism/sensory-calibration.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Sensory Calibration Challenge"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sensory Matching Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Sensory Matching Game</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Match sensory experiences with appropriate coping strategies to build sensory awareness and self-regulation skills.
                  </p>
                </div>
                <button
                  onClick={() => setSensoryMatchingActive(!sensoryMatchingActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${sensoryMatchingActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {sensoryMatchingActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {sensoryMatchingActive && (
                <div
                  className="mt-4 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="sensory-matching-wrapper" className="w-full">
                    <iframe
                      src="/games/autism/sensory-matching.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Sensory Matching Game"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Facial Expression Matcher */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-purple-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">Facial Expression Matcher</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Practice recognizing and matching facial expressions with emotions to improve social understanding and communication.
                  </p>
                </div>
                <button
                  onClick={() => setFacialExpressionActive(!facialExpressionActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${facialExpressionActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {facialExpressionActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {facialExpressionActive && (
                <div
                  className="mt-4 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="facial-expression-wrapper" className="w-full">
                    <iframe
                      src="/games/autism/facial-expression-matcher.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Facial Expression Matcher"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Social Scenario Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-teal-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400">Social Scenario Challenge</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Navigate through social scenarios and practice appropriate responses to build social skills and confidence.
                  </p>
                </div>
                <button
                  onClick={() => setSocialScenarioActive(!socialScenarioActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${socialScenarioActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {socialScenarioActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {socialScenarioActive && (
                <div
                  className="mt-4 border-2 border-teal-200 dark:border-teal-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="social-scenario-wrapper" className="w-full">
                    <iframe
                      src="/games/autism/social-scenario.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Social Scenario Challenge"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Social Story Sequencer */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-pink-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400">Social Story Sequencer</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Learn to understand and navigate social situations through interactive story sequences and decision-making scenarios.
                  </p>
                </div>
                <button
                  onClick={() => setSocialStoryActive(!socialStoryActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${socialStoryActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {socialStoryActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {socialStoryActive && (
                <div
                  className="mt-4 border-2 border-pink-200 dark:border-pink-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="social-story-wrapper" className="w-full">
                    <iframe
                      src="/games/autism/social-story-sequencer.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Social Story Sequencer"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Social Cues Match */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-orange-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400">Social Cues Match</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Practice identifying and matching social cues with appropriate responses in various social contexts.
                  </p>
                </div>
                <button
                  onClick={() => setSocialCuesActive(!socialCuesActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${socialCuesActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {socialCuesActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {socialCuesActive && (
                <div
                  className="mt-4 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="social-cues-wrapper" className="w-full">
                    <iframe
                      src="/games/autism/social-cues-match.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Social Cues Match"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Emotion Regulation Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-emerald-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400">Emotion Regulation Game</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Learn strategies to identify, understand, and manage emotions through interactive scenarios and calming exercises.
                  </p>
                </div>
                <button
                  onClick={() => setEmotionRegulationActive(!emotionRegulationActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${emotionRegulationActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {emotionRegulationActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {emotionRegulationActive && (
                <div
                  className="mt-4 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="emotion-regulation-wrapper" className="w-full">
                    <iframe
                      src="/games/autism/emotion-regulation.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Emotion Regulation Game"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sensory Detective */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-cyan-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-sky-600 dark:from-cyan-400 dark:to-sky-400">Sensory Detective</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Explore and identify different sensory experiences while learning about personal sensory preferences and coping strategies.
                  </p>
                </div>
                <button
                  onClick={() => setSensoryDetectiveActive(!sensoryDetectiveActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${sensoryDetectiveActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {sensoryDetectiveActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {sensoryDetectiveActive && (
                <div
                  className="mt-4 border-2 border-cyan-200 dark:border-cyan-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="sensory-detective-wrapper" className="w-full">
                    <iframe
                      src="/games/autism/sensory-detective.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Sensory Detective"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sensory Overload Manager */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-violet-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400">Sensory Overload Manager</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Practice managing sensory overload through interactive scenarios and learn effective coping techniques.
                  </p>
                </div>
                <button
                  onClick={() => setSensoryOverloadActive(!sensoryOverloadActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${sensoryOverloadActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {sensoryOverloadActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {sensoryOverloadActive && (
                <div
                  className="mt-4 border-2 border-violet-200 dark:border-violet-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="sensory-overload-wrapper" className="w-full">
                    <iframe
                      src="/games/autism/sensory-overload-manager.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Sensory Overload Manager"
                      sandbox="allow-scripts allow-same-origin"
                      className="shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sensory Processing Game */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 border-fuchsia-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-600 dark:from-fuchsia-400 dark:to-pink-400">Sensory Processing Game</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Engage in activities that help understand and process different sensory inputs while building self-awareness.
                  </p>
                </div>
                <button
                  onClick={() => setSensoryProcessingActive(!sensoryProcessingActive)}
                  className={`px-6 py-3 rounded-lg font-medium shadow-md flex-shrink-0 ${sensoryProcessingActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-fuchsia-500 to-pink-600 hover:from-fuchsia-600 hover:to-pink-700'
                    } text-white transition-all duration-300 hover:scale-105 active:scale-95`}
                >
                  {sensoryProcessingActive ? 'Close Game' : 'Start Game'}
                </button>
              </div>

              {sensoryProcessingActive && (
                <div
                  className="mt-4 border-2 border-fuchsia-200 dark:border-fuchsia-800 rounded-xl p-4 overflow-hidden animate-slideDown"
                >
                  <div id="sensory-processing-wrapper" className="w-full">
                    <iframe
                      src="/games/autism/sensory-processing.html"
                      style={{ width: '100%', height: '700px', border: 'none', borderRadius: '12px' }}
                      title="Sensory Processing Game"
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
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">About Autism</h2>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Autism, or Autism Spectrum Disorder (ASD), is a neurodevelopmental condition characterized by differences in social communication, sensory processing, and patterns of behavior and interests.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Key aspects of autism include:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                <li className="transition-transform hover:translate-x-1">Social communication differences</li>
                <li className="transition-transform hover:translate-x-1">Sensory sensitivities or differences</li>
                <li className="transition-transform hover:translate-x-1">Focused interests and repetitive behaviors</li>
                <li className="transition-transform hover:translate-x-1">Different ways of thinking and problem-solving</li>
                <li className="transition-transform hover:translate-x-1">Need for routine and predictability</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                Our interactive games are designed to support skill development in areas that may be challenging, while celebrating the unique strengths and perspectives of autistic individuals.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-fadeIn"
          >
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Autism Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://autismsociety.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center hover:scale-102"
              >
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                  <FiInfo size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-indigo-700 dark:text-indigo-300">Autism Society</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 text-sm">Support, Education, and Advocacy</p>
                </div>
              </a>

              <a
                href="https://www.autismspeaks.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center hover:scale-102"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                  <FiTarget size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-blue-700 dark:text-blue-300">Autism Speaks</h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">Research and Resources</p>
                </div>
              </a>

              <a
                href="https://www.autismresearchcentre.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center hover:scale-102"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                  <FiBookOpen size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-purple-700 dark:text-purple-300">Autism Research Centre</h3>
                  <p className="text-purple-600 dark:text-purple-400 text-sm">Scientific Research and Understanding</p>
                </div>
              </a>

              <a
                href="https://www.autisticadvocacy.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center hover:scale-102"
              >
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                  <FiCoffee size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-teal-700 dark:text-teal-300">Autistic Self Advocacy Network</h3>
                  <p className="text-teal-600 dark:text-teal-400 text-sm">By Autistic People, For Autistic People</p>
                </div>
              </a>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-fadeIn"
          >
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Autism Support Strategies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 p-5 rounded-xl shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-102"
              >
                <h3 className="font-bold text-lg mb-3 text-indigo-700 dark:text-indigo-300 flex items-center">
                  <span className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-2">1</span>
                  Sensory Management
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-indigo-700 dark:text-indigo-300">
                  <li className="transition-transform hover:translate-x-1">Create sensory-friendly environments</li>
                  <li className="transition-transform hover:translate-x-1">Use noise-canceling headphones in loud settings</li>
                  <li className="transition-transform hover:translate-x-1">Provide fidget tools for self-regulation</li>
                  <li className="transition-transform hover:translate-x-1">Establish sensory breaks throughout the day</li>
                </ul>
              </div>

              <div
                className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-5 rounded-xl shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-102"
              >
                <h3 className="font-bold text-lg mb-3 text-purple-700 dark:text-purple-300 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white mr-2">2</span>
                  Communication Support
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-purple-700 dark:text-purple-300">
                  <li className="transition-transform hover:translate-x-1">Use clear, concrete language</li>
                  <li className="transition-transform hover:translate-x-1">Provide visual supports alongside verbal instructions</li>
                  <li className="transition-transform hover:translate-x-1">Allow extra processing time for responses</li>
                  <li className="transition-transform hover:translate-x-1">Respect alternative communication methods</li>
                </ul>
              </div>

              <div
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-5 rounded-xl shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-102"
              >
                <h3 className="font-bold text-lg mb-3 text-blue-700 dark:text-blue-300 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">3</span>
                  Routine and Predictability
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-blue-700 dark:text-blue-300">
                  <li className="transition-transform hover:translate-x-1">Maintain consistent daily routines</li>
                  <li className="transition-transform hover:translate-x-1">Provide visual schedules and timers</li>
                  <li className="transition-transform hover:translate-x-1">Give advance notice of transitions or changes</li>
                  <li className="transition-transform hover:translate-x-1">Create structured, organized environments</li>
                </ul>
              </div>

              <div
                className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 p-5 rounded-xl shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-102"
              >
                <h3 className="font-bold text-lg mb-3 text-teal-700 dark:text-teal-300 flex items-center">
                  <span className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white mr-2">4</span>
                  Social Understanding
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-teal-700 dark:text-teal-300">
                  <li className="transition-transform hover:translate-x-1">Teach social skills explicitly and directly</li>
                  <li className="transition-transform hover:translate-x-1">Use social stories to explain situations</li>
                  <li className="transition-transform hover:translate-x-1">Practice role-playing for different scenarios</li>
                  <li className="transition-transform hover:translate-x-1">Focus on strengths and special interests</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
