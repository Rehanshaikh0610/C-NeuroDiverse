'use client';

import React, { useState } from 'react';
import { FiStar, FiHeart, FiCalendar, FiTag, FiMessageCircle } from 'react-icons/fi';
import Link from 'next/link';

// Mock data for favorite teachers
const initialFavorites = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    title: 'Special Education Specialist',
    specialization: 'Autism',
    expertise: ['Visual Supports', 'Social Skills', 'Sensory Integration'],
    rating: 4.9,
    reviews: 127,
    hourlyRate: 65,
    lastSession: '2023-07-15',
    notes: 'Great at explaining visual learning strategies. Very patient and understanding.',
  },
  {
    id: 2,
    name: 'Dr. Emily Rodriguez',
    title: 'ADHD Education Specialist',
    specialization: 'ADHD',
    expertise: ['Executive Function', 'Time Management', 'Organization Strategies'],
    rating: 4.9,
    reviews: 142,
    hourlyRate: 70,
    lastSession: '2023-07-28',
    notes: 'Excellent strategies for executive function. Provides practical tools that work well.',
  },
  {
    id: 3,
    name: 'David Nguyen, M.Ed.',
    title: 'Literacy Intervention Specialist',
    specialization: 'Dyslexia',
    expertise: ['Multisensory Learning', 'Spelling Strategies', 'Writing Support'],
    rating: 4.8,
    reviews: 112,
    hourlyRate: 65,
    lastSession: null,
    notes: 'Recommended by our support group. Looking forward to working with him.',
  },
];

const FavoriteTeachers = () => {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [filter, setFilter] = useState('all');
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [teacherToRemove, setTeacherToRemove] = useState<number | null>(null);

  // Filter teachers based on specialization
  const filteredTeachers = filter === 'all' 
    ? favorites 
    : favorites.filter(teacher => teacher.specialization.toLowerCase() === filter.toLowerCase());

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No sessions yet';
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle editing notes
  const startEditingNotes = (teacherId: number, currentNotes: string) => {
    setEditingNotes(teacherId);
    setNoteText(currentNotes || '');
  };

  // Save edited notes
  const saveNotes = (teacherId: number) => {
    setFavorites(favorites.map(teacher => 
      teacher.id === teacherId 
        ? { ...teacher, notes: noteText } 
        : teacher
    ));
    setEditingNotes(null);
  };

  // Handle removal from favorites
  const openRemoveModal = (teacherId: number) => {
    setTeacherToRemove(teacherId);
    setShowRemoveModal(true);
  };

  const confirmRemoval = () => {
    if (teacherToRemove) {
      setFavorites(favorites.filter(teacher => teacher.id !== teacherToRemove));
      setShowRemoveModal(false);
      setTeacherToRemove(null);
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

  // Get booking link based on specialization
  const getBookingLink = (specialization: string) => {
    switch (specialization.toLowerCase()) {
      case 'autism':
        return '/teacher-booking/autism';
      case 'adhd':
        return '/teacher-booking/adhd';
      case 'dyslexia':
        return '/teacher-booking/dyslexia';
      default:
        return '/teacher-booking';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-rose-700 text-white">
        <h2 className="text-2xl font-bold">Favorite Teachers</h2>
        <p className="mt-2">
          Manage your favorite specialized teachers for quick access
        </p>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all' 
                ? 'bg-rose-100 text-rose-800 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('all')}
          >
            All Specializations
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'autism' 
                ? 'bg-purple-100 text-purple-800 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('autism')}
          >
            Autism
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'adhd' 
                ? 'bg-blue-100 text-blue-800 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('adhd')}
          >
            ADHD
          </button>
          <button 
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'dyslexia' 
                ? 'bg-green-100 text-green-800 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('dyslexia')}
          >
            Dyslexia
          </button>
        </div>
      </div>

      {/* Teachers List */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {filter === 'all' ? 'All Favorite Teachers' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Specialists`} ({filteredTeachers.length})
        </h3>
        
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No favorite teachers found.</p>
            <Link href="/teacher-booking" className="mt-4 inline-block text-rose-600 hover:text-rose-800">
              Browse teachers to add favorites
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTeachers.map((teacher) => (
              <div 
                key={teacher.id} 
                className="border rounded-xl overflow-hidden transition hover:border-rose-300"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Teacher Image */}
                    <div className="w-full md:w-32 flex-shrink-0">
                      <div className="relative w-32 h-32 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-rose-100">
                        {/* Placeholder for image */}
                        <div className="absolute inset-0 bg-rose-200 flex items-center justify-center">
                          <span className="text-4xl text-rose-600">{teacher.name.charAt(0)}</span>
                        </div>
                        
                        {/* Favorite button */}
                        <button 
                          className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md text-rose-500 hover:text-rose-700"
                          onClick={() => openRemoveModal(teacher.id)}
                          aria-label="Remove from favorites"
                        >
                          <FiHeart className="fill-current" size={18} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Teacher Info */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-800">{teacher.name}</h4>
                          <p className="text-rose-600">{teacher.title}</p>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1 font-medium">{teacher.rating}</span>
                          <span className="ml-1 text-gray-500">({teacher.reviews} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getSpecializationColor(teacher.specialization)}`}>
                          <FiTag className="mr-1" />
                          {teacher.specialization}
                        </span>
                        
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <FiCalendar className="mr-1" />
                          Last Session: {formatDate(teacher.lastSession)}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Expertise</h5>
                        <div className="flex flex-wrap gap-2">
                          {teacher.expertise.map((skill, index) => (
                            <span 
                              key={index} 
                              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-start">
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <FiMessageCircle className="mr-2 text-rose-500" />
                            Personal Notes
                          </h5>
                          <button 
                            className="text-rose-600 hover:text-rose-800"
                            onClick={() => startEditingNotes(teacher.id, teacher.notes || '')}
                          >
                            Edit
                          </button>
                        </div>
                        
                        {editingNotes === teacher.id ? (
                          <div>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 mb-2"
                              rows={3}
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="Add your personal notes about this teacher..."
                            />
                            <div className="flex justify-end space-x-2">
                              <button 
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                onClick={() => setEditingNotes(null)}
                              >
                                Cancel
                              </button>
                              <button 
                                className="px-3 py-1 bg-rose-600 text-white rounded hover:bg-rose-700"
                                onClick={() => saveNotes(teacher.id)}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-600">{teacher.notes || 'No personal notes added yet.'}</p>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-700 font-medium">${teacher.hourlyRate}</span>
                          <span className="text-gray-500"> / hour</span>
                        </div>
                        <Link 
                          href={getBookingLink(teacher.specialization)}
                          className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                        >
                          Book Session
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remove from Favorites Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Remove from Favorites</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove this teacher from your favorites?
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => setShowRemoveModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                onClick={confirmRemoval}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteTeachers; 
