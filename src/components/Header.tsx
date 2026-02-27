'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          NeuroDiverse
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-gray-600 hover:text-blue-600">
                Login
              </Link>
            </li>
            <li>
              <Link href="/register" className="text-gray-600 hover:text-blue-600">
                Register
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 