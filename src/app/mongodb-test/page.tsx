'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function MongoDBTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [connectionDetails, setConnectionDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const testConnection = async () => {
    setLoading(true);
    setConnectionStatus('');
    setConnectionDetails(null);
    setError('');

    try {
      const response = await fetch('/api/test-mongodb');
      const data = await response.json();

      if (data.success) {
        setConnectionStatus('Connected successfully to MongoDB!');
        setConnectionDetails(data.data.connection);
      } else {
        setError(`Connection failed: ${data.message}`);
      }
    } catch (err) {
      setError('An error occurred while testing the connection');
      console.error('Connection test error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mt-4 mb-6">MongoDB Connection Test</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="mb-4">
            This page tests the connection to your MongoDB database. Click the button below to verify the connection.
          </p>
          <button
            onClick={testConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Testing connection...' : 'Test MongoDB Connection'}
          </button>

          {connectionStatus && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
              <p className="font-semibold">{connectionStatus}</p>
              {connectionDetails && (
                <div className="mt-2">
                  <p><strong>Database:</strong> {connectionDetails.name}</p>
                  <p><strong>Host:</strong> {connectionDetails.host}</p>
                  <p><strong>Port:</strong> {connectionDetails.port || 'Default'}</p>
                  <p><strong>Ready State:</strong> {connectionDetails.readyState} (1 = Connected)</p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Link href="/mongodb-test/register" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 h-full hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold mb-2">Register Test User</h2>
              <p className="text-gray-600">
                Create a test user in the MongoDB database to verify write operations.
              </p>
            </div>
          </Link>
          
          <div className="bg-white rounded-lg shadow-md p-6 h-full">
            <h2 className="text-xl font-bold mb-2">View Database</h2>
            <p className="text-gray-600 mb-4">
              Use MongoDB Compass to view your database contents.
            </p>
            <a 
              href="https://www.mongodb.com/products/compass" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Download MongoDB Compass
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">MongoDB Connection Guide</h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Local MongoDB</h3>
            <p className="mb-2">
              Make sure MongoDB is installed and running on your local machine. The application is configured to connect to:
            </p>
            <pre className="bg-gray-100 p-2 rounded">mongodb://localhost:27017/neurodiverse</pre>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">MongoDB Atlas (Cloud)</h3>
            <p className="mb-2">
              To use MongoDB Atlas, update your <code>.env.local</code> file with your Atlas connection string:
            </p>
            <pre className="bg-gray-100 p-2 rounded">MONGODB_URI=mongodb+srv://&lt;username&gt;:&lt;password&gt;@&lt;cluster&gt;.mongodb.net/neurodiverse</pre>
            <p className="mt-2">
              Replace <code>&lt;username&gt;</code>, <code>&lt;password&gt;</code>, and <code>&lt;cluster&gt;</code> with your MongoDB Atlas credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 