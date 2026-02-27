'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { ArrowLeftIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const meditationOptions = [
  { id: 1, name: 'Focus', duration: 5, description: 'Improve concentration and attention' },
  { id: 2, name: 'Calm', duration: 10, description: 'Reduce anxiety and stress' },
  { id: 3, name: 'Sleep', duration: 15, description: 'Prepare your mind for restful sleep' },
  { id: 4, name: 'Mindfulness', duration: 20, description: 'Be present in the moment' },
];

export default function MeditatePage() {
  const { theme } = useTheme();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Load completed sessions from localStorage
    const savedSessions = localStorage.getItem('completedMeditationSessions');
    if (savedSessions) {
      setCompletedSessions(parseInt(savedSessions, 10));
    }
  }, []);

  useEffect(() => {
    if (selectedOption !== null) {
      const option = meditationOptions.find(opt => opt.id === selectedOption);
      if (option) {
        setTimeRemaining(option.duration * 60); // Convert minutes to seconds
      }
    }
  }, [selectedOption]);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isPlaying && timeRemaining === 0) {
      handleSessionComplete();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawBreathingCircle = () => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Calculate size based on breathing pattern (4-7-8 technique)
      const totalCycleTime = 19; // 4 + 7 + 8 seconds
      const cyclePosition = (timeRemaining % totalCycleTime) / totalCycleTime;
      
      let radius;
      let opacity = 0.7;
      let message = '';
      
      if (cyclePosition < 4/19) { // Inhale for 4 seconds
        radius = 50 + (100 * (cyclePosition * 19/4));
        message = 'Breathe in...';
      } else if (cyclePosition < 11/19) { // Hold for 7 seconds
        radius = 150;
        opacity = 0.8;
        message = 'Hold...';
      } else { // Exhale for 8 seconds
        radius = 150 - (100 * ((cyclePosition - 11/19) * 19/8));
        opacity = 0.6;
        message = 'Breathe out...';
      }
      
      // Draw breathing circle
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      
      if (theme === 'dark') {
        gradient.addColorStop(0, 'rgba(79, 209, 197, 0.8)');
        gradient.addColorStop(1, 'rgba(79, 209, 197, 0.1)');
      } else {
        gradient.addColorStop(0, 'rgba(14, 165, 233, 0.8)');
        gradient.addColorStop(1, 'rgba(14, 165, 233, 0.1)');
      }
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw text
      ctx.font = '20px Arial';
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.9)';
      ctx.textAlign = 'center';
      ctx.fillText(message, centerX, centerY + radius + 40);
      
      animationRef.current = requestAnimationFrame(drawBreathingCircle);
    };

    if (isPlaying && selectedOption !== null) {
      drawBreathingCircle();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, timeRemaining, selectedOption, theme]);

  const handleSessionComplete = () => {
    setIsPlaying(false);
    const newCompletedSessions = completedSessions + 1;
    setCompletedSessions(newCompletedSessions);
    localStorage.setItem('completedMeditationSessions', newCompletedSessions.toString());
  };

  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSession = () => {
    setIsPlaying(false);
    if (selectedOption !== null) {
      const option = meditationOptions.find(opt => opt.id === selectedOption);
      if (option) {
        setTimeRemaining(option.duration * 60);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Link href="/dashboard">
          <button className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </Link>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
          <span className="text-gray-700 dark:text-gray-300">
            Sessions completed: <span className="font-bold text-blue-600 dark:text-blue-400">{completedSessions}</span>
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Meditation Space
        </h1>

        {/* Meditation Options */}
        {selectedOption === null ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {meditationOptions.map(option => (
              <div
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-600"
              >
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{option.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{option.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {option.duration} minutes
                  </span>
                  <span className="text-2xl">
                    {option.name === 'Focus' && '🧠'}
                    {option.name === 'Calm' && '😌'}
                    {option.name === 'Sleep' && '💤'}
                    {option.name === 'Mindfulness' && '🌱'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Meditation Timer */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 w-full max-w-2xl mb-8 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {meditationOptions.find(opt => opt.id === selectedOption)?.name} Meditation
                </h2>
                <button
                  onClick={() => setSelectedOption(null)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  Change
                </button>
              </div>

              <div className="flex flex-col items-center">
                {/* Timer Display */}
                <div className="text-5xl font-bold mb-8 text-gray-800 dark:text-gray-100">
                  {formatTime(timeRemaining)}
                </div>

                {/* Breathing Animation Canvas */}
                <div className="relative w-full h-64 mb-8">
                  <canvas 
                    ref={canvasRef} 
                    width={400} 
                    height={300}
                    className="mx-auto"
                  />
                </div>

                {/* Controls */}
                <div className="flex space-x-4">
                  <button
                    onClick={togglePlayPause}
                    className={`flex items-center justify-center w-14 h-14 rounded-full ${
                      isPlaying
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white transition-colors duration-300 shadow-md`}
                  >
                    {isPlaying ? (
                      <PauseIcon className="h-6 w-6" />
                    ) : (
                      <PlayIcon className="h-6 w-6" />
                    )}
                  </button>
                  <button
                    onClick={resetSession}
                    className="flex items-center justify-center px-4 h-14 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 shadow-md"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-xl p-6 w-full max-w-2xl">
              <h3 className="text-lg font-bold mb-3 text-blue-800 dark:text-blue-300">Meditation Tips</h3>
              <ul className="list-disc list-inside space-y-2 text-blue-700 dark:text-blue-200">
                <li>Find a quiet, comfortable place to sit</li>
                <li>Keep your back straight but not stiff</li>
                <li>Focus on your breath, in and out</li>
                <li>When your mind wanders, gently bring it back to your breath</li>
                <li>Be kind to yourself - meditation is a practice</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
