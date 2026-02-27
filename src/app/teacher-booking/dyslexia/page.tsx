'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Mock data for teachers
const dyslexiaTeachers = [
  {
    id: 1,
    name: 'Dr. Rebecca Taylor',
    title: 'Dyslexia Education Specialist',
    expertise: ['Orton-Gillingham Approach', 'Phonological Awareness', 'Reading Fluency'],
    rating: 4.9,
    reviews: 156,
    hourlyRate: 75,
    availability: ['Mon', 'Tue', 'Wed', 'Thu'],
    image: '/images/teacher9.jpg',
    bio: 'Dr. Taylor is certified in the Orton-Gillingham approach and specializes in developing phonological awareness and reading fluency in students with dyslexia. She has over 12 years of experience working with dyslexic learners of all ages.',
  },
  {
    id: 2,
    name: 'David Nguyen, M.Ed.',
    title: 'Literacy Intervention Specialist',
    expertise: ['Multisensory Learning', 'Spelling Strategies', 'Writing Support'],
    rating: 4.8,
    reviews: 112,
    hourlyRate: 65,
    availability: ['Tue', 'Wed', 'Fri', 'Sat'],
    image: '/images/teacher10.jpg',
    bio: 'David specializes in multisensory learning approaches for dyslexic students. His teaching focuses on developing spelling strategies and providing writing support through structured literacy techniques.',
  },
  {
    id: 3,
    name: 'Dr. Olivia Martinez',
    title: 'Educational Psychologist',
    expertise: ['Cognitive Assessment', 'Structured Literacy', 'Assistive Technology'],
    rating: 4.9,
    reviews: 128,
    hourlyRate: 80,
    availability: ['Mon', 'Thu', 'Fri', 'Sun'],
    image: '/images/teacher11.jpg',
    bio: 'Dr. Martinez specializes in cognitive assessments and structured literacy approaches for dyslexic learners. She helps students leverage assistive technology to support their learning journey.',
  },
  {
    id: 4,
    name: 'Sarah Johnson, M.S.',
    title: 'Dyslexia Intervention Coach',
    expertise: ['Wilson Reading System', 'Comprehension Strategies', 'Self-Advocacy Skills'],
    rating: 4.7,
    reviews: 94,
    hourlyRate: 60,
    availability: ['Wed', 'Thu', 'Sat', 'Sun'],
    image: '/images/teacher12.jpg',
    bio: 'Sarah is certified in the Wilson Reading System and specializes in developing comprehension strategies for dyslexic students. She also focuses on building self-advocacy skills to help students succeed in mainstream educational settings.',
  },
];

const DyslexiaTeacherBooking = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [filterExpertise, setFilterExpertise] = useState<string>('');

  // Filter teachers based on expertise
  const filteredTeachers = filterExpertise 
    ? dyslexiaTeachers.filter(teacher => 
        teacher.expertise.some(skill => 
          skill.toLowerCase().includes(filterExpertise.toLowerCase())
        )
      )
    : dyslexiaTeachers;

  // Generate available dates (next 14 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const teacher = dyslexiaTeachers.find(t => t.id === selectedTeacher);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Only include days when the teacher is available
      if (teacher && teacher.availability.includes(dayName)) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })
        });
      }
    }
    
    return dates;
  };

  // Generate available time slots
  const getAvailableTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push({
        value: `${hour}:00`,
        label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
      });
      
      if (hour < endHour) {
        slots.push({
          value: `${hour}:30`,
          label: `${hour > 12 ? hour - 12 : hour}:30 ${hour >= 12 ? 'PM' : 'AM'}`
        });
      }
    }
    
    return slots;
  };

  const handleBookSession = () => {
    // In a real app, this would send the booking to an API
    alert(`Booking confirmed with ${dyslexiaTeachers.find(t => t.id === selectedTeacher)?.name} on ${selectedDate} at ${selectedTime}`);
    
    // Reset booking form
    setSelectedTeacher(null);
    setSelectedDate('');
    setSelectedTime('');
    setBookingStep(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-green-700 text-white">
        <h2 className="text-2xl font-bold">Dyslexia Education Specialists</h2>
        <p className="mt-2">
          Connect with teachers specialized in supporting dyslexic learners through structured literacy approaches
        </p>
      </div>

      {/* Search and Filter */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Expertise
            </label>
            <input
              type="text"
              id="expertise"
              placeholder="e.g. Orton-Gillingham, Multisensory Learning"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              value={filterExpertise}
              onChange={(e) => setFilterExpertise(e.target.value)}
            />
          </div>
          <div className="w-full md:w-auto self-end">
            <button 
              className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              onClick={() => setFilterExpertise('')}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Teacher List */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Available Teachers ({filteredTeachers.length})
        </h3>
        
        <div className="space-y-6">
          {filteredTeachers.map((teacher) => (
            <div 
              key={teacher.id} 
              className={`border rounded-xl overflow-hidden transition ${
                selectedTeacher === teacher.id 
                  ? 'border-green-500 ring-2 ring-green-200' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Teacher Image */}
                  <div className="w-full md:w-32 flex-shrink-0">
                    <div className="relative w-32 h-32 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-green-100">
                      {/* Placeholder for image - in a real app, use actual teacher images */}
                      <div className="absolute inset-0 bg-green-200 flex items-center justify-center">
                        <span className="text-4xl text-green-600">{teacher.name.charAt(0)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Teacher Info */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800">{teacher.name}</h4>
                        <p className="text-green-600">{teacher.title}</p>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 font-medium">{teacher.rating}</span>
                        <span className="ml-1 text-gray-500">({teacher.reviews} reviews)</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{teacher.bio}</p>
                    
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Expertise</h5>
                      <div className="flex flex-wrap gap-2">
                        {teacher.expertise.map((skill, index) => (
                          <span 
                            key={index} 
                            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <span className="text-gray-700 font-medium">${teacher.hourlyRate}</span>
                        <span className="text-gray-500"> / hour</span>
                      </div>
                      <button 
                        className={`mt-3 sm:mt-0 px-6 py-2 rounded-lg transition ${
                          selectedTeacher === teacher.id
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                        onClick={() => {
                          setSelectedTeacher(teacher.id);
                          setBookingStep(2);
                        }}
                      >
                        {selectedTeacher === teacher.id ? 'Selected' : 'Book Session'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Booking Form - Only show if this teacher is selected */}
              {selectedTeacher === teacher.id && bookingStep >= 2 && (
                <div className="p-6 bg-green-50 border-t border-green-200">
                  <h4 className="text-lg font-semibold text-green-800 mb-4">
                    Book a Session with {teacher.name}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date Selection */}
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Date
                      </label>
                      <select
                        id="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          if (e.target.value) setBookingStep(3);
                        }}
                      >
                        <option value="">Select a date</option>
                        {getAvailableDates().map((date) => (
                          <option key={date.value} value={date.value}>
                            {date.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Time Selection - Only show if date is selected */}
                    {bookingStep >= 3 && (
                      <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                          Select Time
                        </label>
                        <select
                          id="time"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                          value={selectedTime}
                          onChange={(e) => {
                            setSelectedTime(e.target.value);
                            if (e.target.value) setBookingStep(4);
                          }}
                        >
                          <option value="">Select a time</option>
                          {getAvailableTimeSlots().map((slot) => (
                            <option key={slot.value} value={slot.value}>
                              {slot.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  
                  {/* Confirm Booking - Only show if both date and time are selected */}
                  {bookingStep >= 4 && selectedDate && selectedTime && (
                    <div className="mt-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                        <h5 className="font-medium text-gray-800 mb-2">Booking Summary</h5>
                        <p className="text-gray-600">
                          <span className="font-medium">Teacher:</span> {teacher.name}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Date:</span> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Time:</span> {parseInt(selectedTime.split(':')[0]) > 12 
                            ? `${parseInt(selectedTime.split(':')[0]) - 12}:${selectedTime.split(':')[1]} PM` 
                            : `${selectedTime} AM`}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Duration:</span> 1 hour
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Price:</span> ${teacher.hourlyRate}
                        </p>
                      </div>
                      
                      <button 
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                        onClick={handleBookSession}
                      >
                        Confirm Booking
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {filteredTeachers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No teachers found matching your criteria.</p>
              <button 
                className="mt-4 text-green-600 hover:text-green-800"
                onClick={() => setFilterExpertise('')}
              >
                Clear filters and show all teachers
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DyslexiaTeacherBooking; 
