'use client';

import React from 'react';
import Link from 'next/link';

interface TeacherBookingIconProps {
  type: 'autism' | 'adhd' | 'dyslexia';
  className?: string;
}

const TeacherBookingIcon: React.FC<TeacherBookingIconProps> = ({ type, className = '' }) => {
  // Define colors based on neurodivergence type
  const getColors = () => {
    switch (type) {
      case 'autism':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900',
          border: 'border-purple-200 dark:border-purple-700',
          icon: 'text-purple-600 dark:text-purple-300',
          hover: 'hover:bg-purple-200 dark:hover:bg-purple-800'
        };
      case 'adhd':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900',
          border: 'border-orange-200 dark:border-orange-700',
          icon: 'text-orange-600 dark:text-orange-300',
          hover: 'hover:bg-orange-200 dark:hover:bg-orange-800'
        };
      case 'dyslexia':
        return {
          bg: 'bg-teal-100 dark:bg-teal-900',
          border: 'border-teal-200 dark:border-teal-700',
          icon: 'text-teal-600 dark:text-teal-300',
          hover: 'hover:bg-teal-200 dark:hover:bg-teal-800'
        };
      default:
        return {
          bg: 'bg-blue-100 dark:bg-blue-900',
          border: 'border-blue-200 dark:border-blue-700',
          icon: 'text-blue-600 dark:text-blue-300',
          hover: 'hover:bg-blue-200 dark:hover:bg-blue-800'
        };
    }
  };

  const colors = getColors();
  
  // Get the appropriate link based on the type
  const getLink = () => {
    switch (type) {
      case 'autism':
        return '/autism#teacher-booking';
      case 'adhd':
        return '/adhd#teacher-booking';
      case 'dyslexia':
        return '/dyslexia#teacher-booking';
      default:
        return '/';
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Link href={getLink()}>
        <div className={`${colors.bg} ${colors.hover} rounded-full w-12 h-12 flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-300 border ${colors.border} transform hover:scale-105`}>
          <div className="relative w-7 h-7">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={`w-7 h-7 ${colors.icon}`}
            >
              <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </Link>
      <span className={`ml-3 font-medium ${colors.icon}`}>Book a Teacher</span>
    </div>
  );
};

export default TeacherBookingIcon; 