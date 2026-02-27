'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestMongoDB() {
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [userCount, setUserCount] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [registrationResult, setRegistrationResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Test database connection when component mounts
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('Connecting to MongoDB...');
      const response = await fetch('/api/test-db');
      const data = await response.json();
      
      if (data.success) {
        setConnectionStatus('Connected to MongoDB successfully!');
        setUserCount(data.data.userCount);
      } else {
        setConnectionStatus(`Failed to connect: ${data.message}`);
      }
    } catch (error) {
      setConnectionStatus('Error connecting to MongoDB');
      console.error('Connection test error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRegistrationResult('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setRegistrationResult(`User registered successfully! User ID: ${data.data.id}`);
        setFormData({ name: '', email: '', password: '' });
        // Refresh the user count
        testConnection();
      } else {
        setRegistrationResult(`Registration failed: ${data.message || data.error}`);
      }
    } catch (error) {
      setRegistrationResult('Error during registration');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-4">MongoDB Connection Test</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
            <p className={`mb-2 ${connectionStatus.includes('Successfully') ? 'text-green-600 dark:text-green-400' : connectionStatus.includes('Failed') ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
              {connectionStatus || 'Not tested yet'}
            </p>
            {userCount !== null && (
              <p className="mb-4">Current users in database: <span className="font-semibold">{userCount}</span></p>
            )}
            <button 
              onClick={testConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Test Connection
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Register a Test User</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Registering...' : 'Register User'}
            </button>
          </form>
          
          {registrationResult && (
            <div className={`mt-4 p-3 rounded ${registrationResult.includes('successfully') ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
              {registrationResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 