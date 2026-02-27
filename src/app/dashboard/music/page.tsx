'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiUser, FiMusic, FiHeart, FiInfo, FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useMusic } from '@/components/music/MusicContext';

export default function MusicPage() {
  const [userName, setUserName] = useState('');
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('nature');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    audioTracks,
    playTrack,
    togglePlay,
    setVolume,
    toggleMute
  } = useMusic();

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

    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Start or stop animation when playing state changes
  useEffect(() => {
    if (isPlaying && canvasRef.current) {
      drawWaveform();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [isPlaying]);

  // Draw waveform animation
  const drawWaveform = () => {
    if (!canvasRef.current || !isPlaying) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set wave properties
    const amplitude = height / 4; // Height of the wave
    const frequency = 0.05; // Frequency of the wave
    const waveSpeed = 0.1; // Speed of the wave

    // Get current time for animation
    const now = Date.now() / 1000;

    // Set line style
    ctx.lineWidth = 2;
    ctx.strokeStyle = theme === 'dark' ? '#60a5fa' : '#3b82f6'; // Blue color

    // Draw the wave
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
      // Create multiple overlapping sine waves for a more complex effect
      const y = height / 2 +
        amplitude * Math.sin((x * frequency) + (now * waveSpeed)) * 0.5 +
        amplitude * Math.sin((x * frequency * 0.8) + (now * waveSpeed * 1.2)) * 0.3 +
        amplitude * Math.sin((x * frequency * 1.2) + (now * waveSpeed * 0.8)) * 0.2;

      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Continue animation
    animationRef.current = requestAnimationFrame(drawWaveform);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
              <FiArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Relaxation Music</h1>
          </div>
          <div className="flex items-center">
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
              onClick={() => setActiveTab('nature')}
              className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'nature'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <FiMusic className="mr-2" />
              Nature Sounds
            </button>
            <button
              onClick={() => setActiveTab('rain')}
              className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'rain'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <FiMusic className="mr-2" />
              Rain Sounds
            </button>
            <button
              onClick={() => setActiveTab('piano')}
              className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'piano'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <FiMusic className="mr-2" />
              Piano Music
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-lg flex items-center ${activeTab === 'about'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <FiInfo className="mr-2" />
              About Music Therapy
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto py-2 px-4 mb-24">
        {/* Nature Sounds Tab */}
        {activeTab === 'nature' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400">Nature Sounds</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Natural sounds can help reduce stress, improve focus, and promote a sense of calm. These recordings capture the peaceful ambiance of forests and natural environments.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {audioTracks.nature.map(track => (
                  <div
                    key={track.id}
                    className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{track.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{track.description}</p>
                      </div>
                      <button
                        onClick={() => playTrack(track)}
                        className={`p-3 rounded-full ${currentTrack?.id === track.id && isPlaying
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                          } text-white shadow-md hover:scale-110 active:scale-95 transition-all duration-200`}
                      >
                        {currentTrack?.id === track.id && isPlaying ? <FiPause /> : <FiPlay />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rain Sounds Tab */}
        {activeTab === 'rain' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">Rain Sounds</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Rain sounds can mask distracting noises, improve sleep quality, and create a soothing atmosphere for relaxation or study. Choose from various rain environments.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {audioTracks.rain.map(track => (
                  <div
                    key={track.id}
                    className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{track.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{track.description}</p>
                      </div>
                      <button
                        onClick={() => playTrack(track)}
                        className={`p-3 rounded-full ${currentTrack?.id === track.id && isPlaying
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                          } text-white shadow-md hover:scale-110 active:scale-95 transition-all duration-200`}
                      >
                        {currentTrack?.id === track.id && isPlaying ? <FiPause /> : <FiPlay />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Piano Music Tab */}
        {activeTab === 'piano' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">Piano Music</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Piano music can enhance cognitive function, reduce anxiety, and create a peaceful environment for work or relaxation. These compositions are designed to promote focus and calm.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {audioTracks.piano.map(track => (
                  <div
                    key={track.id}
                    className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{track.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{track.description}</p>
                      </div>
                      <button
                        onClick={() => playTrack(track)}
                        className={`p-3 rounded-full ${currentTrack?.id === track.id && isPlaying
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-purple-500 hover:bg-purple-600'
                          } text-white shadow-md hover:scale-110 active:scale-95 transition-all duration-200`}
                      >
                        {currentTrack?.id === track.id && isPlaying ? <FiPause /> : <FiPlay />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* About Music Therapy Tab */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400">About Music Therapy</h2>

              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Music therapy is a clinical and evidence-based practice that uses music interventions to accomplish individualized goals within a therapeutic relationship. Research supports its effectiveness for improving mental health, reducing stress, and enhancing cognitive function.
                </p>

                <h3 className="text-xl font-semibold mt-4 text-indigo-600 dark:text-indigo-400">Benefits of Music for Neurodiversity</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li><span className="font-medium">For ADHD:</span> Music can improve focus, reduce hyperactivity, and help with emotional regulation.</li>
                  <li><span className="font-medium">For Autism:</span> Music can enhance communication skills, emotional understanding, and provide sensory regulation.</li>
                  <li><span className="font-medium">For Dyslexia:</span> Rhythmic music can support phonological awareness and reading skills.</li>
                  <li><span className="font-medium">For Anxiety:</span> Calming music reduces stress hormones and promotes relaxation.</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4 text-indigo-600 dark:text-indigo-400">How to Use This Music Section</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Choose sounds that resonate with you based on your current needs:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li><span className="font-medium">For focus:</span> Try piano music or gentle nature sounds.</li>
                  <li><span className="font-medium">For relaxation:</span> Rain sounds are particularly effective.</li>
                  <li><span className="font-medium">For sleep:</span> Consistent, gentle sounds like rain or forest ambiance.</li>
                  <li><span className="font-medium">For meditation:</span> Any of the tracks can support mindfulness practice.</li>
                </ul>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300 flex items-center">
                    <FiHeart className="mr-2" /> Pro Tip
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">
                    For maximum benefit, use headphones to fully immerse yourself in the audio experience. Consider creating a consistent routine where you use specific sounds for specific activities to build helpful associations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Fixed audio controls at bottom if a track is selected */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg p-4 border-t border-gray-200 dark:border-gray-700 animate-slideUp">
          <div className="container mx-auto">
            {/* Waveform visualization */}
            <div className="mb-3 h-16 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                width={1000}
                height={64}
              />
            </div>

            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
              <div className="flex items-center">
                <button
                  onClick={togglePlay}
                  className={`p-3 mr-4 rounded-full ${isPlaying
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                    } text-white shadow-md hover:scale-110 active:scale-95 transition-all duration-200`}
                >
                  {isPlaying ? <FiPause /> : <FiPlay />}
                </button>
                <div>
                  <h3 className="font-semibold">{currentTrack.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Now Playing</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 w-full md:w-1/2">
                <button
                  onClick={toggleMute}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {isMuted ? <FiVolumeX /> : <FiVolume2 />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
