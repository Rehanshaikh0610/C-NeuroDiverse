'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Mock data for ADHD teachers
const adhdTeachers = [
  {
    id: 1,
    name: 'Dr. Emily Rodriguez',
    title: 'ADHD Education Specialist',
    expertise: ['Executive Function', 'Time Management', 'Organization Strategies'],
    rating: 4.9,
    reviews: 142,
    hourlyRate: 70,
    availability: ['Mon', 'Tue', 'Wed', 'Thu'],
    image: '/images/teacher5.jpg',
    bio: 'Dr. Rodriguez specializes in helping students with ADHD develop executive function skills. Her approach combines evidence-based strategies with personalized learning plans to build organization and time management skills.',
  },
  {
    id: 2,
    name: 'Marcus Thompson, M.Ed.',
    title: 'Learning Strategies Coach',
    expertise: ['Focus Techniques', 'Study Skills', 'Motivation Building'],
    rating: 4.7,
    reviews: 89,
    hourlyRate: 60,
    availability: ['Tue', 'Wed', 'Fri', 'Sat'],
    image: '/images/teacher6.jpg',
    bio: 'Marcus helps students with ADHD develop practical study skills and focus techniques. His coaching emphasizes strengths-based approaches and building intrinsic motivation for learning.',
  },
  {
    id: 3,
    name: 'Dr. Sophia Kim',
    title: 'Educational Psychologist',
    expertise: ['Cognitive Strategies', 'Self-Regulation', 'Strength-Based Learning'],
    rating: 4.8,
    reviews: 103,
    hourlyRate: 75,
    availability: ['Mon', 'Thu', 'Fri', 'Sun'],
    image: '/images/teacher7.jpg',
    bio: 'Dr. Kim specializes in cognitive strategies for ADHD learners. Her approach focuses on developing self-regulation skills while leveraging each student\'s unique cognitive strengths.',
  },
];

const ADHDTeacherBooking = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [filterExpertise, setFilterExpertise] = useState<string>('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Filter teachers based on expertise
  const filteredTeachers = filterExpertise
    ? adhdTeachers.filter(teacher =>
      teacher.expertise.some(skill =>
        skill.toLowerCase().includes(filterExpertise.toLowerCase())
      )
    )
    : adhdTeachers;

  // Generate available dates (next 14 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const teacher = adhdTeachers.find(t => t.id === selectedTeacher);
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
    alert(`Booking confirmed with ${adhdTeachers.find(t => t.id === selectedTeacher)?.name} on ${selectedDate} at ${selectedTime}`);

    // Reset booking form
    setSelectedTeacher(null);
    setSelectedDate('');
    setSelectedTime('');
    setBookingStep(1);
    setShowBookingForm(false);
  };

  return (
    <div className="mb-10">
      {!showBookingForm ? (
        <motion.div
          className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl p-6 text-white shadow-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Connect with Specialized Teachers</h2>
              <p className="mb-4 md:mb-0">
                Book one-on-one sessions with teachers experienced in ADHD education
              </p>
            </div>
            <button
              onClick={() => setShowBookingForm(true)}
              className="bg-white text-orange-700 hover:bg-orange-100 px-6 py-2 rounded-lg font-medium transition"
            >
              Book a Teacher
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 bg-blue-700 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">ADHD Education Specialists</h2>
                <p className="mt-2">
                  Connect with teachers specialized in supporting students with ADHD
                </p>
              </div>
              <button
                onClick={() => setShowBookingForm(false)}
                className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-1 rounded-lg text-sm"
              >
                Back to Resources
              </button>
            </div>
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
                  placeholder="e.g. Executive Function, Focus Techniques"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={filterExpertise}
                  onChange={(e) => setFilterExpertise(e.target.value)}
                />
              </div>
              <div className="w-full md:w-auto self-end">
                <button
                  className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
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
                  className={`border rounded-xl overflow-hidden transition ${selectedTeacher === teacher.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300'
                    }`}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Teacher Image */}
                      <div className="w-full md:w-32 flex-shrink-0">
                        <div className="relative w-32 h-32 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-blue-100">
                          {/* Placeholder for image - in a real app, use actual teacher images */}
                          <div className="absolute inset-0 bg-blue-200 flex items-center justify-center">
                            <span className="text-4xl text-blue-600">{teacher.name.charAt(0)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Teacher Info */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                          <div>
                            <h4 className="text-xl font-semibold text-gray-800">{teacher.name}</h4>
                            <p className="text-blue-600">{teacher.title}</p>
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
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
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
                            className={`mt-3 sm:mt-0 px-6 py-2 rounded-lg transition ${selectedTeacher === teacher.id
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
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
                    <div className="p-6 bg-blue-50 border-t border-blue-200">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4">
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
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
                    className="mt-4 text-blue-600 hover:text-blue-800"
                    onClick={() => setFilterExpertise('')}
                  >
                    Clear filters and show all teachers
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ADHDTeacherBooking; 