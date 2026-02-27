'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Demo companies that hire neurodiverse individuals
const companies = [
  {
    id: 1,
    name: 'NeuroTech Solutions',
    logo: '/images/companies/neurotech.png',
    description: 'A technology company that specializes in developing assistive software with a workforce comprised of 40% neurodivergent individuals.',
    positions: [
      'Pattern Recognition Specialist', 
      'Data Entry Assistant', 
      'Software Testing Helper',
      'Visual Design Support'
    ],
    website: 'https://www.neurotechsolutions.com'
  },
  {
    id: 2,
    name: 'Spectrum Creations',
    logo: '/images/companies/spectrum.png',
    description: 'An art gallery and online marketplace that showcases and sells artwork created by neurodivergent artists, providing them with employment and creative opportunities.',
    positions: [
      'Art Packaging Assistant', 
      'Gallery Helper', 
      'Online Listing Creator',
      'Art Materials Organizer'
    ],
    website: 'https://www.spectrumcreations.com'
  },
  {
    id: 3,
    name: 'Inclusive Data',
    logo: '/images/companies/inclusive.png',
    description: 'A data processing company that values the detail-oriented skills and pattern recognition abilities that many neurodivergent individuals excel at.',
    positions: [
      'Data Sorting Assistant', 
      'Information Categorizer', 
      'Document Scanner',
      'Digital File Organizer'
    ],
    website: 'https://www.inclusivedata.com'
  },
  {
    id: 4,
    name: 'Sensory Friendly Foods',
    logo: '/images/companies/sensory.png',
    description: 'A food production company that creates sensory-friendly food products while providing a supportive work environment for neurodivergent employees.',
    positions: [
      'Product Packaging Helper', 
      'Inventory Counter', 
      'Quality Check Assistant',
      'Label Application Specialist'
    ],
    website: 'https://www.sensoryfriendlyfoods.com'
  },
  {
    id: 5,
    name: 'Diverse Minds Media',
    logo: '/images/companies/diverseminds.png',
    description: 'A digital media company that produces content celebrating neurodiversity while employing creators across the spectrum.',
    positions: [
      'Media Sorting Assistant', 
      'Transcription Helper', 
      'Digital Asset Organizer',
      'Content Tagging Specialist'
    ],
    website: 'https://www.diversemindsmedia.com'
  }
];

export default function Employment() {
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  // Update the formData state type to properly handle the file
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    resume: null as File | null, // Add proper typing for the resume field
    coverLetter: '',
    accommodations: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        resume: e.target.files[0]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Submitting application:', formData);
    alert('Your application has been submitted successfully! The company will contact you soon.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      resume: null,
      coverLetter: '',
      accommodations: ''
    });
    setSelectedCompany(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-indigo-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back button with enhanced styling */}
        <Link href="/dashboard" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 transition-colors duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-2 px-4 rounded-lg shadow-sm">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Employment Opportunities</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Discover companies that actively hire and support neurodiverse individuals
          </p>
        </div>

        {selectedCompany === null ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div 
                key={company.id} 
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{company.name}</h2>
                    <div className="h-12 w-12 relative">
                      {/* Enhanced company logo placeholder */}
                      <div className="bg-blue-100 dark:bg-blue-900 h-full w-full rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold">
                        {company.name.charAt(0)}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{company.description}</p>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Open Positions:</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.positions.map((position, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs px-3 py-1 rounded-full"
                        >
                          {position}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
                    >
                      <span>Visit Website</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <button 
                      onClick={() => setSelectedCompany(company.id)} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm hover:shadow"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <button 
              onClick={() => setSelectedCompany(null)} 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 inline-flex items-center bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Companies
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Apply to {companies.find(c => c.id === selectedCompany)?.name}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form fields remain the same but with enhanced styling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Position
                  </label>
                  <select
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a position</option>
                    {companies.find(c => c.id === selectedCompany)?.positions.map((position, index) => (
                      <option key={index} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resume/CV
                </label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Accepted formats: PDF, DOC, DOCX
                </p>
              </div>
              
              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cover Letter
                </label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="accommodations" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Accommodations Needed (Optional)
                </label>
                <textarea
                  id="accommodations"
                  name="accommodations"
                  value={formData.accommodations}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Please describe any accommodations you may need during the application process or in the workplace."
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="consent" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  I consent to having my data processed for recruitment purposes
                </label>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="mt-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Choose a Neurodiverse-Friendly Employer?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Inclusive Environment</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Companies with neurodiversity programs create supportive workplaces that value different thinking styles.
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Specialized Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access to mentors, accommodations, and resources designed for neurodiverse individuals.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Career Growth</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Opportunities for advancement in companies that recognize and value neurodivergent talents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
