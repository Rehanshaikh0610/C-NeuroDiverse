'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RegisterTestPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');

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
        setResult(data);
        setFormData({ name: '', email: '', password: '' });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/mongodb-test" className="text-blue-600 hover:underline">
            &larr; Back to MongoDB Test
          </Link>
          <h1 className="text-3xl font-bold mt-4 mb-6">Register Test User</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="mb-4">
            Use this form to register a test user in your MongoDB database.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {loading ? 'Registering...' : 'Register User'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
              <p className="font-semibold">User registered successfully!</p>
              <div className="mt-2">
                <p><strong>ID:</strong> {result.data.id}</p>
                <p><strong>Name:</strong> {result.data.name}</p>
                <p><strong>Email:</strong> {result.data.email}</p>
                <p><strong>Created At:</strong> {new Date(result.data.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">How This Works</h2>
          <p className="mb-2">
            When you submit this form, the following happens:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>The form data is sent to the <code>/api/register</code> API route</li>
            <li>The API connects to your MongoDB database</li>
            <li>It checks if a user with the same email already exists</li>
            <li>If not, it hashes the password and creates a new user document</li>
            <li>The new user is stored in the <code>users</code> collection in your database</li>
          </ol>
          <p className="mt-4">
            You can view the registered users in your MongoDB database using MongoDB Compass or the MongoDB shell.
          </p>
        </div>
      </div>
    </div>
  );
} 
