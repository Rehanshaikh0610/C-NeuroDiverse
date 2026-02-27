'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFire, FaStar } from 'react-icons/fa';
import Link from 'next/link';

interface UserProgressProps {
  level: number;
  points: number;
  streakDays?: number;
  className?: string;
}

const UserProgressBar: React.FC<UserProgressProps> = ({ 
  level, 
  points, 
  streakDays = 0,
  className = '' 
}) => {
  // Calculate progress to next level (every 100 points is a new level)
  const pointsToNextLevel = 100;
  const currentLevelPoints = points % pointsToNextLevel;
  const progressPercent = (currentLevelPoints / pointsToNextLevel) * 100;
  
  // For animation
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  useEffect(() => {
    setAnimatedProgress(progressPercent);
  }, [progressPercent]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <span className="text-purple-700 dark:text-purple-300 font-bold text-lg">{level}</span>
            </div>
            {streakDays > 0 && (
              <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                <FaFire className="text-xs" />
              </div>
            )}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Level {level}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentLevelPoints} / {pointsToNextLevel} points to next level
            </p>
          </div>
        </div>
        
        {streakDays > 0 && (
          <div className="flex items-center bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded-full">
            <FaFire className="text-orange-500 dark:text-orange-400 mr-1 text-sm" />
            <span className="text-xs font-medium text-orange-700 dark:text-orange-300">{streakDays} day streak</span>
          </div>
        )}
      </div>
      
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${animatedProgress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <div className="flex items-center">
          <FaStar className="text-yellow-500 mr-1 text-sm" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{points} total points</span>
        </div>
        <Link href="/dashboard/activity">
          <button className="text-xs text-purple-600 dark:text-purple-400 hover:underline">
            View Activity
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserProgressBar; 