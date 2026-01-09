"use client";

import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side: logo + links */}
        <div className="flex items-center space-x-8">
          <div className="font-bold text-xl text-emerald-600 dark:text-emerald-500">
            JAKT
          </div>

          <div className="hidden md:flex space-x-4">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link href="/programs" className="nav-link">
              Programs
            </Link>
            <Link href="/workouts" className="nav-link">
              Workouts
            </Link>
            <Link href="/progress" className="nav-link">
              Progress
            </Link>
          </div>
        </div>

        {/* Right side: auth buttons */}
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-500"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
          >
            Sign Up
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-gray-700 dark:text-gray-300 focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <Link href="/" className="block nav-link">
            Home
          </Link>
          <Link href="/dashboard" className="block nav-link">
            Dashboard
          </Link>

          <Link href="/programs" className="block nav-link">
            Programs
          </Link>
          <Link href="/workouts" className="block nav-link">
            Workouts
          </Link>
          <Link href="/progress" className="block nav-link">
            Progress
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
