'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import { ArrowLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
        <p className="text-xl text-gray-800 dark:text-gray-200">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 p-6 border-4 border-black dark:border-gray-700 transition-colors duration-300">
      {/* Header with Back Button and User Circle */}
      <div className="flex justify-between items-center mb-12">
        <Link href="/dashboard">
          <button className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 px-4 py-2 rounded-md font-medium text-blue-800 dark:text-blue-200 transition-colors duration-300">
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Dashboard
          </button>
        </Link>

        <div className="w-10 h-10 bg-green-300 dark:bg-green-700 rounded-full flex items-center justify-center text-green-800 dark:text-green-200 font-medium transition-colors duration-300">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">User Profile</h1>
        
        {/* User Info Card */}
        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 mb-8 shadow-md border border-blue-200 dark:border-blue-800 transition-colors duration-300">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-blue-300 dark:bg-blue-700 rounded-full flex items-center justify-center text-blue-800 dark:text-blue-200 font-bold text-2xl mr-4 transition-colors duration-300">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user?.name || 'User'}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          
          <div className="border-t border-blue-200 dark:border-blue-800 pt-4 transition-colors duration-300">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-medium">Account created:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Last login:</span> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {/* Theme Settings */}
        <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-6 mb-8 shadow-md border border-purple-200 dark:border-purple-800 transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Theme Settings</h2>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-300">Current theme:</span>
            <span className="font-medium text-purple-700 dark:text-purple-300 capitalize">{theme}</span>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-700 dark:text-gray-300">Toggle theme:</span>
            <ThemeToggle />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleThemeChange('light')}
              className={`py-2 px-4 rounded-md font-medium transition-colors duration-300 ${
                theme === 'light' 
                  ? 'bg-yellow-200 text-yellow-800 border-2 border-yellow-400' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Light Mode
            </button>
            
            <button 
              onClick={() => handleThemeChange('dark')}
              className={`py-2 px-4 rounded-md font-medium transition-colors duration-300 ${
                theme === 'dark' 
                  ? 'bg-indigo-700 text-indigo-100 border-2 border-indigo-500' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Dark Mode
            </button>
          </div>
        </div>
        
        {/* Notification Settings Placeholder */}
        <div className="bg-green-50 dark:bg-green-950 rounded-lg p-6 shadow-md border border-green-200 dark:border-green-800 transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Notification Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Task reminders</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Email notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Weekly summary</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
