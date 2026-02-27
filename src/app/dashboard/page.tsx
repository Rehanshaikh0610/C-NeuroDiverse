'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import Image from 'next/image';
import { Button, CardContent, CardHeader, Paper, Divider, Chip, Box, Typography, LinearProgress } from "@mui/material"; // Enhanced Material UI imports
import styles from './dashboard.module.css';

import UserProgressBar from '@/components/UserProgressBar';
import UserProgressGraph from '@/components/UserProgressGraph';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(0);
  const [points, setPoints] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    // Check if user data exists in localStorage - only on client side
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Set default values for progress or get from user data if available
        setLevel(parsedUser.level || 1);
        setPoints(parsedUser.points || 25);
        setStreakDays(parsedUser.streakDays || 3);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-200 dark:bg-blue-700 rounded-full mb-4"></div>
          <div className="h-4 w-24 bg-blue-200 dark:bg-blue-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 transition-colors duration-300 overflow-x-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
        <div className={`absolute top-0 left-0 w-full h-full ${styles.gridPattern}`}></div>
      </div>
      
      {/* Remove the floating chat widget div that was here */}
      
      {/* Rest of your dashboard content remains the same */}
      {/* Including the ChatBot card in Tools & Resources section */}
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300 dark:bg-blue-700 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-300 dark:bg-purple-700 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Header - Enhanced with Material Dash style */}
      <header className="w-full py-4 px-6 flex justify-between items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-blue-100 dark:border-blue-900/30">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
            N
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            NeuroDiverse
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-3 mr-4">
            {/* Quick Access Icons */}
            <Link href="/dashboard/meditate">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-300 border border-blue-200 dark:border-blue-700 transform hover:scale-105">
                <div className="relative w-6 h-6">
                  <Image 
                    src="/images/meditation.svg" 
                    alt="Meditation" 
                    width={24} 
                    height={24} 
                    className="object-contain"
                  />
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/diary">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-300 border border-blue-200 dark:border-blue-700 transform hover:scale-105">
                <div className="relative w-6 h-6">
                  <Image 
                    src="/images/diary.svg" 
                    alt="Personal Diary" 
                    width={24} 
                    height={24} 
                    className="object-contain"
                  />
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/music">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-300 border border-blue-200 dark:border-blue-700 transform hover:scale-105">
                <span className="text-lg">🎵</span>
              </div>
            </Link>
          </div>

          <ThemeToggle className="mr-2" />
          
          {/* Menu Dropdown */}
          <div className="relative mr-3">
            <Menu>
              <Menu.Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-lg font-medium flex items-center text-white transition-colors duration-300 shadow-md hover:shadow-lg">
                Menu
                <ChevronDownIcon className="ml-2 h-5 w-5" />
              </Menu.Button>
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-2 z-10">
                  <Menu.Item>
                    {({ active }) => (
                      <Link href="/dashboard/task-manager">
                        <button
                          className={`${
                            active ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                          } group flex w-full items-center rounded-md px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300`}
                        >
                          Task Manager
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link href="/dashboard/todo-list">
                        <button
                          className={`${
                            active ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                          } group flex w-full items-center rounded-md px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300`}
                        >
                          To-Do List
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          
          {/* Profile Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700 rounded-full flex items-center justify-center text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Menu.Button>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3 z-10">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                </div>
                
                <div className="py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <Link href="/dashboard/profile">
                        <button className={`${
                          active ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                        } group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-900 dark:text-gray-100`}>
                          <UserCircleIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                          Profile
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link href="/dashboard/settings">
                        <button className={`${
                          active ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                        } group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-900 dark:text-gray-100`}>
                          <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                          Settings
                        </button>
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                
                <div className="py-2 border-t border-gray-200 dark:border-gray-700">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-red-100 dark:bg-red-900/30' : ''
                        } group flex w-full items-center rounded-md px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-red-500 dark:text-red-400" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-grow flex flex-col px-6 py-8 max-w-7xl mx-auto w-full relative z-10">
        {/* Welcome Banner */}
        <Paper elevation={0} className="mb-6 bg-gradient-to-r from-blue-600/95 to-purple-700/95 dark:from-blue-900/95 dark:to-purple-900/95 backdrop-blur-md rounded-xl overflow-hidden relative">
          <Box className="p-6 relative z-10">
            <Typography variant="h4" className="font-bold mb-2 text-gray-900 dark:text-white">Welcome back, {user?.name || 'User'}!</Typography>
            <Typography variant="body1" className="opacity-90 mb-4 text-gray-800 dark:text-gray-100">Continue your neurodiversity journey today</Typography>
            <Chip 
              label={`Level ${level} • ${points} XP`} 
              className="bg-white/20 text-gray-900 dark:text-white backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors"
            />
          </Box>
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm"></div>
        </Paper>

        {/* Stats Cards Row - Material UI Enhanced */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Paper elevation={2} className={`p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-blue-100/50 dark:border-blue-800/30 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-102 ${styles.floatingCard}`}>
            <Box className="flex justify-between items-start">
              <Box>
                <Typography variant="body2" className="text-blue-600 dark:text-blue-400 font-medium mb-1">Daily Streak</Typography>
                <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">{streakDays} days</Typography>
              </Box>
              <Box className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shadow-md">
                <span className="text-lg">🔥</span>
              </Box>
            </Box>
            <Box className="mt-3">
              <LinearProgress 
                variant="determinate" 
                value={Math.min(streakDays * 10, 100)} 
                className="h-1.5 rounded-full" 
                sx={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(219, 234, 254, 0.8)',
                  '& .MuiLinearProgress-bar': {
                    backgroundImage: 'linear-gradient(to right, #3b82f6, #2563eb)'
                  }
                }}
              />
            </Box>
          </Paper>

          <Paper elevation={2} className={`p-5 backdrop-blur-sm border border-purple-100/50 dark:border-purple-800/30 rounded-xl transition-all duration-300 hover:shadow-lg ${styles.floatingCard}`}>
            <Box className="flex justify-between items-start">
              <Box>
                <Typography variant="body2" color="text.secondary" className="mb-1">Current Level</Typography>
                <Typography variant="h5" className="font-bold">Level {level}</Typography>
              </Box>
              <Box className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shadow-md">
                <span className="text-xl">🏆</span>
              </Box>
            </Box>
            <Box className="mt-4">
              <LinearProgress 
                variant="determinate" 
                value={Math.min(level * 20, 100)} 
                className="h-2 rounded-full" 
                sx={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(147, 51, 234, 0.2)' : 'rgba(243, 232, 255, 0.8)',
                  '& .MuiLinearProgress-bar': {
                    backgroundImage: 'linear-gradient(to right, #8b5cf6, #7c3aed)'
                  }
                }}
              />
            </Box>
          </Paper>

          <Paper elevation={2} className={`p-5 backdrop-blur-sm border border-green-100/50 dark:border-green-800/30 rounded-xl transition-all duration-300 hover:shadow-lg ${styles.floatingCard}`}>
            <Box className="flex justify-between items-start">
              <Box>
                <Typography variant="body2" color="text.secondary" className="mb-1">XP Points</Typography>
                <Typography variant="h5" className="font-bold">{points} XP</Typography>
              </Box>
              <Box className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shadow-md">
                <span className="text-xl">⭐</span>
              </Box>
            </Box>
            <Box className="mt-4">
              <LinearProgress 
                variant="determinate" 
                value={Math.min(points, 100)} 
                className="h-2 rounded-full" 
                sx={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 252, 231, 0.8)',
                  '& .MuiLinearProgress-bar': {
                    backgroundImage: 'linear-gradient(to right, #22c55e, #16a34a)'
                  }
                }}
              />
            </Box>
          </Paper>

          <Paper elevation={2} className={`p-5 backdrop-blur-sm border border-indigo-100/50 dark:border-indigo-800/30 rounded-xl transition-all duration-300 hover:shadow-lg ${styles.floatingCard}`}>
            <Box className="flex justify-between items-start">
              <Box>
                <Typography variant="body2" color="text.secondary" className="mb-1">Activities</Typography>
                <Typography variant="h5" className="font-bold">Daily</Typography>
              </Box>
              <Box className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shadow-md">
                <span className="text-xl">📊</span>
              </Box>
            </Box>
            <Box className="mt-4">
              <LinearProgress 
                variant="determinate" 
                value={75} 
                className="h-2 rounded-full" 
                sx={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(224, 231, 255, 0.8)',
                  '& .MuiLinearProgress-bar': {
                    backgroundImage: 'linear-gradient(to right, #6366f1, #4f46e5)'
                  }
                }}
              />
            </Box>
          </Paper>
        </div>

        {/* User Progress Section - Enhanced with Material UI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Paper elevation={3} className="lg:col-span-2 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-blue-100/50 dark:border-blue-800/30 rounded-xl p-4 transition-all duration-300 hover:shadow-lg">
            <Box className="flex items-center justify-between mb-3">
              <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">Your Progress</Typography>
              <Chip 
                label={`LEVEL ${level}`}
                icon={<span className="ml-1">🏆</span>}
                className="bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-500 dark:to-purple-600 text-white font-bold shadow-md hover:shadow-lg transition-shadow"
              />
            </Box>
            
            <Box className="w-full">
              <UserProgressBar 
                level={level} 
                points={points} 
                streakDays={streakDays} 
                className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg hover:shadow-lg transition-shadow"
              />
            </Box>
          </Paper>

          <Paper elevation={3} className="backdrop-blur-sm border border-purple-100/50 dark:border-purple-800/30 rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
            <Typography variant="h6" className="font-bold mb-4">Activity Summary</Typography>
            <UserProgressGraph 
              activities={[
                { type: 'Learning', points: 25, timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
                { type: 'Exercise', points: 15, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
                { type: 'Meditation', points: 10, timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
                { type: 'Learning', points: 20, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
                { type: 'Exercise', points: 15, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
                { type: 'Meditation', points: 10, timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
                { type: 'Learning', points: 30, timestamp: new Date().toISOString() },
              ]} 
              className="h-full"
            />
          </Paper>
        </div>

        {/* Main Categories - Material UI Enhanced */}
        <Box className="mb-8">
          <Typography variant="h5" className="font-bold mb-6 pl-2 border-l-4 border-blue-500 dark:border-blue-400">
            Neurodiversity Support
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-80 transition duration-500"></div>
              <Link href="/dashboard/autism" className="block h-full">
                <Paper elevation={2} className={`relative h-full backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border border-blue-200/50 dark:border-blue-700/50 ${styles.floatingCard}`}>
                  <Box className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-2xl text-white">🧩</span>
                  </Box>
                  <Typography variant="h6" className="font-semibold text-center">Autism</Typography>
                  <Typography variant="body2" color="text.secondary" className="mt-2 text-center">Resources & support</Typography>
                  <Chip 
                    label="Explore" 
                    size="small" 
                    className="mt-4 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                  />
                </Paper>
              </Link>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-80 transition duration-500"></div>
              <Link href="/dashboard/adhd" className="block h-full">
                <Paper elevation={2} className={`relative h-full backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border border-pink-200/50 dark:border-pink-700/50 ${styles.floatingCard}`}>
                  <Box className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 dark:from-pink-500 dark:to-pink-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-2xl text-white">⚡</span>
                  </Box>
                  <Typography variant="h6" className="font-semibold text-center">ADHD</Typography>
                  <Typography variant="body2" color="text.secondary" className="mt-2 text-center">Focus & organization</Typography>
                  <Chip 
                    label="Explore" 
                    size="small" 
                    className="mt-4 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200"
                  />
                </Paper>
              </Link>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-80 transition duration-500"></div>
              <Link href="/dashboard/dyslexia" className="block h-full">
                <Paper elevation={2} className={`relative h-full backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border border-yellow-200/50 dark:border-yellow-700/50 ${styles.floatingCard}`}>
                  <Box className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-2xl text-white">📚</span>
                  </Box>
                  <Typography variant="h6" className="font-semibold text-center">Dyslexia</Typography>
                  <Typography variant="body2" color="text.secondary" className="mt-2 text-center">Reading assistance</Typography>
                  <Chip 
                    label="Explore" 
                    size="small" 
                    className="mt-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                  />
                </Paper>
              </Link>
            </div>
          </div>
        </Box>

        {/* Tools & Resources Section - Material UI Enhanced */}
        <Box className="mb-10">
          <Typography variant="h5" className="font-bold mb-6 pl-2 border-l-4 border-purple-500 dark:border-purple-400">
            Tools & Resources
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ChatBot Card */}
            <div className={`relative group md:col-span-1 ${styles.glowBorder}`}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-80 transition duration-500"></div>
              <Link href="/dashboard/chatbot" className="block h-full">
                <Paper elevation={2} className={`relative h-full backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50 ${styles.floatingCard}`}>
                  <Box className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-2xl text-white">💬</span>
                  </Box>
                  <Typography variant="h6" className="font-semibold text-center">ChatBot</Typography>
                  <Typography variant="body2" color="text.secondary" className="mt-2 text-center">AI assistance</Typography>
                  <Button 
                    variant="contained" 
                    size="small" 
                    className="mt-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                  >
                    Open
                  </Button>
                </Paper>
              </Link>
            </div>
            
            {/* Face Detection Card */}
            <div className={`relative group md:col-span-1 ${styles.glowBorder}`}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl blur opacity-30 group-hover:opacity-80 transition duration-500"></div>
              <Link href="/dashboard/facedetection" className="block h-full">
                <Paper elevation={2} className={`relative h-full backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border border-green-200/50 dark:border-green-700/50 ${styles.floatingCard}`}>
                  <Box className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-2xl text-white">😊</span>
                  </Box>
                  <Typography variant="h6" className="font-semibold text-center">Face Detection</Typography>
                  <Typography variant="body2" color="text.secondary" className="mt-2 text-center">Emotion analysis</Typography>
                  <Button 
                    variant="contained" 
                    size="small" 
                    className="mt-4 bg-gradient-to-r from-green-500 to-teal-600 text-white"
                  >
                    Open
                  </Button>
                </Paper>
              </Link>
            </div>
            
            {/* Employment Card */}
            <div className={`relative group md:col-span-1 ${styles.glowBorder}`}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-80 transition duration-500"></div>
              <Link href="/dashboard/employment" className="block h-full">
                <Paper elevation={2} className={`relative h-full backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border border-indigo-200/50 dark:border-indigo-700/50 ${styles.floatingCard}`}>
                  <Box className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 dark:from-indigo-500 dark:to-indigo-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-2xl text-white">💼</span>
                  </Box>
                  <Typography variant="h6" className="font-semibold text-center">Employment</Typography>
                  <Typography variant="body2" color="text.secondary" className="mt-2 text-center">Career opportunities</Typography>
                  <Button 
                    variant="contained" 
                    size="small" 
                    className="mt-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white"
                  >
                    Open
                  </Button>
                </Paper>
              </Link>
            </div>
          </div>
        </Box>
        
        {/* Quick Access Tools - Material UI Enhanced */}
        <Box className="mb-6">
          <Typography variant="h5" className="font-bold mb-6 pl-2 border-l-4 border-blue-500 dark:border-blue-400">
            Quick Access
          </Typography>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Link href="/dashboard/task-manager">
              <Paper elevation={1} className={`backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 transition-all duration-300 border border-blue-100/50 dark:border-blue-800/30 ${styles.floatingCard}`}>
                <Box className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-lg">📝</span>
                </Box>
                <Typography variant="body1" className="font-medium">Tasks</Typography>
              </Paper>
            </Link>
            
            <Link href="/dashboard/todo-list">
              <Paper elevation={1} className={`backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 transition-all duration-300 border border-purple-100/50 dark:border-purple-800/30 ${styles.floatingCard}`}>
                <Box className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-lg">✓</span>
                </Box>
                <Typography variant="body1" className="font-medium">To-Do</Typography>
              </Paper>
            </Link>
            
            <Link href="/dashboard/diary">
              <Paper elevation={1} className={`backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 transition-all duration-300 border border-green-100/50 dark:border-green-800/30 ${styles.floatingCard}`}>
                <Box className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-lg">📔</span>
                </Box>
                <Typography variant="body1" className="font-medium">Diary</Typography>
              </Paper>
            </Link>
            
            <Link href="/dashboard/meditate">
              <Paper elevation={1} className={`backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 transition-all duration-300 border border-indigo-100/50 dark:border-indigo-800/30 ${styles.floatingCard}`}>
                <Box className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-lg">🧘</span>
                </Box>
                <Typography variant="body1" className="font-medium">Meditate</Typography>
              </Paper>
            </Link>
          </div>
        </Box>
      </main>
    </div>
  );
}


