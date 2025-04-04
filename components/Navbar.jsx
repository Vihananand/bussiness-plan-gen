'use client';

import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                BusinessPlan
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/generator" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Plan Generator
              </Link>
              <Link href="/about" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Link href="/contact" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </Link>
              <Link href="/login" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <Link href="/signup" className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-md text-sm font-medium">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link href="/generator" className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium">
              Plan Generator
            </Link>
            <Link href="/about" className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium">
              About
            </Link>
            <Link href="/contact" className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium">
              Contact
            </Link>
            <Link href="/login" className="block bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium">
              Login
            </Link>
            <Link href="/signup" className="block bg-pink-600 hover:bg-pink-700 px-3 py-2 rounded-md text-base font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;