'use client';

import React from 'react';
import Link from 'next/link';
import { FiUsers, FiBookOpen, FiBrain, FiCalendar, FiHeart, FiArrowRight } from 'react-icons/fi';

const TeacherBookingIndex = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8 bg-gradient-to-r from-indigo-700 to-purple-700 text-white">
        <h2 className="text-3xl font-bold mb-2">Specialized Teacher Booking</h2>
        <p className="text-lg opacity-90 max-w-3xl">
          Connect with expert teachers specialized in supporting neurodiverse learners. 
          Book personalized sessions tailored to your specific learning needs.
        </p>
      </div>

      {/* Specialization Cards */}
      <div className="p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Find Teachers by Specialization</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Autism Card */}
          <Link 
            href="/teacher-booking/autism"
            className="group block rounded-xl overflow-hidden border border-gray-200 transition hover:shadow-md hover:border-purple-300"
          >
            <div className="h-32 bg-purple-600 flex items-center justify-center">
              <FiUsers className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-gray-800">Autism Specialists</h4>
                <FiArrowRight className="text-purple-600 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <p className="text-gray-600">
                Connect with teachers specialized in visual supports, social skills, and sensory integration strategies.
              </p>
            </div>
          </Link>
          
          {/* ADHD Card */}
          <Link 
            href="/teacher-booking/adhd"
            className="group block rounded-xl overflow-hidden border border-gray-200 transition hover:shadow-md hover:border-blue-300"
          >
            <div className="h-32 bg-blue-600 flex items-center justify-center">
              <FiBrain className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-gray-800">ADHD Specialists</h4>
                <FiArrowRight className="text-blue-600 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <p className="text-gray-600">
                Find teachers who excel in executive function, focus techniques, and organization strategies.
              </p>
            </div>
          </Link>
          
          {/* Dyslexia Card */}
          <Link 
            href="/teacher-booking/dyslexia"
            className="group block rounded-xl overflow-hidden border border-gray-200 transition hover:shadow-md hover:border-green-300"
          >
            <div className="h-32 bg-green-600 flex items-center justify-center">
              <FiBookOpen className="text-white text-5xl" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-gray-800">Dyslexia Specialists</h4>
                <FiArrowRight className="text-green-600 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <p className="text-gray-600">
                Book sessions with teachers skilled in structured literacy, multisensory learning, and reading strategies.
              </p>
            </div>
          </Link>
        </div>
        
        {/* Manage Bookings Section */}
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Manage Your Learning Journey</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* My Bookings Card */}
          <Link 
            href="/teacher-booking/my-bookings"
            className="group flex items-center p-6 rounded-xl border border-gray-200 transition hover:shadow-md hover:border-indigo-300"
          >
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mr-6">
              <FiCalendar className="text-indigo-600 text-2xl" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-lg font-semibold text-gray-800">My Bookings</h4>
                <FiArrowRight className="text-indigo-600 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <p className="text-gray-600">
                View and manage your upcoming and past sessions with specialized teachers.
              </p>
            </div>
          </Link>
          
          {/* Favorite Teachers Card */}
          <Link 
            href="/teacher-booking/favorites"
            className="group flex items-center p-6 rounded-xl border border-gray-200 transition hover:shadow-md hover:border-rose-300"
          >
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mr-6">
              <FiHeart className="text-rose-600 text-2xl" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-lg font-semibold text-gray-800">Favorite Teachers</h4>
                <FiArrowRight className="text-rose-600 opacity-0 group-hover:opacity-100 transition" />
              </div>
              <p className="text-gray-600">
                Access your saved favorite teachers for quick booking and reference.
              </p>
            </div>
          </Link>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="p-8 bg-gray-50 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h3>
        
        <div className="space-y-6 max-w-4xl">
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">How do teacher bookings work?</h4>
            <p className="text-gray-600">
              Browse teachers by specialization, select a teacher that matches your needs, choose an available date and time, and confirm your booking. You'll receive confirmation details and can manage all your bookings in the "My Bookings" section.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">What happens during a session?</h4>
            <p className="text-gray-600">
              Sessions are typically conducted via video call and last for 60 minutes. Teachers will work with you on specific learning strategies tailored to your needs. You can add notes before sessions to help teachers prepare, and after sessions to track progress.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">How do I prepare for my first session?</h4>
            <p className="text-gray-600">
              Before your first session, we recommend adding detailed notes about your learning goals and any specific challenges you'd like to address. Having examples of schoolwork or specific topics ready can help make the session more productive.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Can I change or cancel my booking?</h4>
            <p className="text-gray-600">
              Yes, you can manage all your bookings in the "My Bookings" section. Cancellations made at least 24 hours before the scheduled session will receive a full refund. Changes to the date and time can be made subject to teacher availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherBookingIndex; 