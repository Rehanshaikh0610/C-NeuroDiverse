'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { FaStar, FaFire, FaCheck, FaBook, FaMedal, FaBrain, FaCalendarCheck, FaUserGraduate, FaComments, FaHeadphones } from 'react-icons/fa';
import UserProgressGraph from '@/components/UserProgressGraph';

interface ActivityItem {
  id: string;
  type: 'task' | 'streak' | 'level' | 'quiz' | 'meditation' | 'diary' | 'teacher_booking' | 'login' | 'chat_interaction' | 'resource_accessed' | 'music';
  title: string;
  description: string;
  points: number;
  date: string;
  icon: React.ReactNode;
}

export default function ActivityPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'graph'>('list');

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
      
      // Mock activity data - in a real app, this would come from an API
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'task',
          title: 'Completed Task',
          description: 'Finished daily organization task',
          points: 10,
          date: '2023-06-15T14:30:00',
          icon: <FaCheck className="text-green-500" />
        },
        {
          id: '2',
          type: 'streak',
          title: 'Streak Milestone',
          description: 'Maintained a 3-day streak',
          points: 15,
          date: '2023-06-14T09:15:00',
          icon: <FaFire className="text-orange-500" />
        },
        {
          id: '3',
          type: 'level',
          title: 'Level Up',
          description: 'Reached Level 2',
          points: 50,
          date: '2023-06-12T18:45:00',
          icon: <FaMedal className="text-yellow-500" />
        },
        {
          id: '4',
          type: 'quiz',
          title: 'Quiz Completed',
          description: 'Scored 85% on ADHD knowledge quiz',
          points: 20,
          date: '2023-06-10T11:20:00',
          icon: <FaBrain className="text-purple-500" />
        },
        {
          id: '5',
          type: 'meditation',
          title: 'Meditation Session',
          description: 'Completed a 10-minute meditation',
          points: 15,
          date: '2023-06-09T20:00:00',
          icon: <FaStar className="text-blue-500" />
        },
        {
          id: '6',
          type: 'diary',
          title: 'Diary Entry',
          description: 'Added a new personal diary entry',
          points: 5,
          date: '2023-06-08T21:30:00',
          icon: <FaBook className="text-indigo-500" />
        },
        {
          id: '7',
          type: 'teacher_booking',
          title: 'Teacher Session',
          description: 'Booked a session with Dr. Emily Rodriguez',
          points: 20,
          date: '2023-06-07T15:00:00',
          icon: <FaUserGraduate className="text-green-600" />
        },
        {
          id: '8',
          type: 'login',
          title: 'Daily Login',
          description: 'Logged in for 5 consecutive days',
          points: 5,
          date: '2023-06-06T09:00:00',
          icon: <FaCalendarCheck className="text-teal-500" />
        },
        {
          id: '9',
          type: 'chat_interaction',
          title: 'ChatBot Interaction',
          description: 'Had a productive conversation with the AI assistant',
          points: 10,
          date: '2023-06-05T16:45:00',
          icon: <FaComments className="text-blue-600" />
        },
        {
          id: '10',
          type: 'music',
          title: 'Music Therapy',
          description: 'Completed a 15-minute music therapy session',
          points: 15,
          date: '2023-06-04T19:30:00',
          icon: <FaHeadphones className="text-purple-600" />
        }
      ];
      
      setActivities(mockActivities);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Prepare data for the graph
  const graphData = activities.map(activity => ({
    type: activity.type,
    points: activity.points,
    timestamp: activity.date
  }));

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={() => router.back()} 
          className="mr-4 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors duration-300 shadow-md"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity History</h1>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Points</h3>
            <FaStar className="text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {activities.reduce((sum, activity) => sum + activity.points, 0)}
          </p>
        </div>
        
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Activities</h3>
            <FaCheck className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {activities.length}
          </p>
        </div>
        
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Streak</h3>
            <FaFire className="text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {user?.streakDays || 3} days
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'list'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('list')}
        >
          Activity List
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'graph'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('graph')}
        >
          Progress Graph
        </button>
      </div>

      {/* Activity Content */}
      {activeTab === 'list' ? (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-4">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                      +{activity.points} <FaStar className="ml-1 text-yellow-500 text-xs" />
                    </div>
                    <div className="mt-1 flex flex-col items-end">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(activity.date)}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(activity.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <UserProgressGraph activities={graphData} className="mb-8" />
      )}
    </div>
  );
} 