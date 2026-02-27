'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TeacherBookingLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Teacher Booking</h1>
          <p className="text-gray-600">
            Connect with specialized teachers for personalized learning sessions
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-indigo-600 text-white">
                <h2 className="font-semibold text-lg">Specializations</h2>
              </div>
              <nav className="p-2">
                <ul className="space-y-1">
                  <li>
                    <Link 
                      href="/teacher-booking/autism"
                      className={`block px-4 py-2 rounded-lg transition ${
                        isActive('/teacher-booking/autism') 
                          ? 'bg-indigo-100 text-indigo-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Autism Specialists
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/teacher-booking/adhd"
                      className={`block px-4 py-2 rounded-lg transition ${
                        isActive('/teacher-booking/adhd') 
                          ? 'bg-indigo-100 text-indigo-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      ADHD Specialists
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/teacher-booking/dyslexia"
                      className={`block px-4 py-2 rounded-lg transition ${
                        isActive('/teacher-booking/dyslexia') 
                          ? 'bg-indigo-100 text-indigo-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Dyslexia Specialists
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="p-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Booking Options</h3>
                <ul className="space-y-1">
                  <li>
                    <Link 
                      href="/teacher-booking/my-bookings"
                      className={`block px-4 py-2 rounded-lg transition ${
                        isActive('/teacher-booking/my-bookings') 
                          ? 'bg-indigo-100 text-indigo-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      My Bookings
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/teacher-booking/favorites"
                      className={`block px-4 py-2 rounded-lg transition ${
                        isActive('/teacher-booking/favorites') 
                          ? 'bg-indigo-100 text-indigo-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Favorite Teachers
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-indigo-50">
                <h3 className="font-medium text-indigo-700 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Our support team is here to help you find the right teacher for your needs.
                </p>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition">
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherBookingLayout; 
