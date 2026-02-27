'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useMusic } from './MusicContext';
import NeonBorder from './NeonBorder';
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaVolumeMute,
} from 'react-icons/fa';

const MiniPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    setVolume: setMusicVolume,
    toggleMute: toggleMusicMute,
    playTrack: nextTrack,
    playTrack: previousTrack,
    audioRef,
  } = useMusic();

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const updateProgress = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      audio.addEventListener('timeupdate', updateProgress);
      return () => audio.removeEventListener('timeupdate', updateProgress);
    }
  }, [audioRef]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMusicVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    toggleMusicMute();
    setIsMuted(!isMuted);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * audioRef.current.duration;
    }
  };

  if (!currentTrack) return null;

  return (
    <NeonBorder
      color="rainbow"
      intensity="high"
      animated={true}
      pulseSpeed="medium"
      className="fixed bottom-6 left-6 w-80"
    >
      <div className="bg-black/90 backdrop-blur-lg p-4 rounded-xl">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate">
              {currentTrack.title}
            </h3>
            <p className="text-xs text-gray-400 truncate">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div
          ref={progressBarRef}
          className="mt-4 h-1 bg-gray-800 rounded-full cursor-pointer group"
          onClick={handleProgressBarClick}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full group-hover:from-purple-400 group-hover:to-blue-400"
            style={{ width: `${progress}%` }}
            initial={false}
          />
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={previousTrack}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaStepBackward size={18} />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white flex items-center justify-center transition-all transform hover:scale-105"
            >
              {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} className="ml-1" />}
            </button>
            <button
              onClick={nextTrack}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaStepForward size={18} />
            </button>
          </div>

          {/* Volume control */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
            </button>
            <div className="w-20 group">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full accent-purple-500 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(168, 85, 247) ${volume * 100}%, rgb(55, 65, 81) ${volume * 100}%)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </NeonBorder>
  );
};

export default MiniPlayer; 