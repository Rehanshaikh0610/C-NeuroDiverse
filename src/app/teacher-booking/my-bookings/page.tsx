'use client';

import React, { useState } from 'react';
import { FiCalendar, FiClock, FiUser, FiTag, FiEdit2, FiTrash2, FiMessageSquare } from 'react-icons/fi';

// Mock data for bookings
const initialBookings = [
  {
    id: 1,
    teacherName: 'Dr. Sarah Johnson',
    teacherTitle: 'Special Education Specialist',
    specialization: 'Autism',
    date: '2023-08-15',
    time: '10:00',
    duration: 60,
    status: 'upcoming',
    notes: 'Discuss visual learning strategies and social skills development',
  },
  {
    id: 2,
    teacherName: 'Dr. Emily Rodriguez',
    teacherTitle: 'ADHD Education Specialist',
    specialization: 'ADHD',
    date: '2023-08-18',
    time: '14:30',
    duration: 60,
    status: 'upcoming',
    notes: 'Focus on executive function skills and organization strategies',
  },
  {
    id: 3,
    teacherName: 'David Nguyen, M.Ed.',
    teacherTitle: 'Literacy Intervention Specialist',
    specialization: 'Dyslexia',
    date: '2023-07-28',
    time: '11:00',
    duration: 60,
    status: 'completed',
    notes: 'Worked on multisensory spelling strategies',
  },
  {
    id: 4,
    teacherName: 'Marcus Thompson, M.Ed.',
    teacherTitle: 'Learning Strategies Coach',
    specialization: 'ADHD',
    date: '2023-07-20',
    time: '15:00',
    duration: 60,
    status: 'completed',
    notes: 'Discussed study skills and focus techniques',
  },
];

const MyBookings = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState('all');
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);

  // Filter bookings based on status
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Handle editing notes
  const startEditingNotes = (bookingId: number, currentNotes: string) => {
    setEditingNotes(bookingId);
    setNoteText(currentNotes);
  };

  // Save edited notes
  const saveNotes = (bookingId: number) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, notes: noteText } 
        : booking
    ));
    setEditingNotes(null);
  };

  // Handle cancellation
  const openCancelModal = (bookingId: number) => {
    setBookingToCancel(bookingId);
    setShowCancelModal(true);
  };

  const confirmCancellation = () => {
    if (bookingToCancel) {
      setBookings(bookings.filter(booking => booking.id !== bookingToCancel));
      setShowCancelModal(false);
      setBookingToCancel(null);
    }
  };

  // Get color class based on specialization
  const getSpecializationColor = (specialization: string) => {
    switch (specialization.toLowerCase()) {
      case 'autism':
        return 'bg-purple-100 text-purple-800';
      case 'adhd':
        return 'bg-blue-100 text-blue-800';
      case 'dyslexia':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-indigo-700 text-white">
        <h2 className="text-2xl font-bold">My Bookings</h2>
        <p className="mt-2">
          Manage your scheduled sessions with specialized teachers
        </p>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all' 
                ? 'bg-indigo-100 text-indigo-800 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('all')}
          >
            All Bookings
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'upcoming' 
                ? 'bg-indigo-100 text-indigo-800 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'completed' 
                ? 'bg-indigo-100 text-indigo-800 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {filter === 'all' ? 'All Bookings' : 
           filter === 'upcoming' ? 'Upcoming Sessions' : 
           'Completed Sessions'} ({filteredBookings.length})
        </h3>
        
        {filteredBookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No bookings found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="border rounded-xl overflow-hidden transition hover:border-indigo-300"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">{booking.teacherName}</h4>
                      <p className="text-indigo-600">{booking.teacherTitle}</p>
                    </div>
                    <div className="mt-2 lg:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getSpecializationColor(booking.specialization)}`}>
                        <FiTag className="mr-1" />
                        {booking.specialization}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FiCalendar className="mr-2 text-indigo-500" />
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiClock className="mr-2 text-indigo-500" />
                      <span>{formatTime(booking.time)} ({booking.duration} minutes)</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-start">
                      <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiMessageSquare className="mr-2 text-indigo-500" />
                        Session Notes
                      </h5>
                      {booking.status === 'upcoming' && (
                        <button 
                          className="text-indigo-600 hover:text-indigo-800"
                          onClick={() => startEditingNotes(booking.id, booking.notes)}
                        >
                          <FiEdit2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    {editingNotes === booking.id ? (
                      <div>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                          rows={3}
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                          <button 
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            onClick={() => setEditingNotes(null)}
                          >
                            Cancel
                          </button>
                          <button 
                            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            onClick={() => saveNotes(booking.id)}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600">{booking.notes || 'No notes added yet.'}</p>
                    )}
                  </div>
                  
                  {booking.status === 'upcoming' && (
                    <div className="flex justify-end">
                      <button 
                        className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                        onClick={() => openCancelModal(booking.id)}
                      >
                        <FiTrash2 className="mr-2" />
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Cancel Booking</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Booking
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={confirmCancellation}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings; 