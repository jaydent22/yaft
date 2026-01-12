"use client";

import Link from "next/link";
import { useState } from "react";
import AnchoredMenu from "./AnchoredMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800 p-2 md:p-4 sticky top-0 z-50">
      <div className="flex items-center md:justify-between">
        {/*Left: burger mobile, logo + nav links desktop */}
        <div className="flex items-center w-1/3 md:w-auto">
          <div className="md:hidden">
            <AnchoredMenu
              button={
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
              }
            >
              {({ closeMenu }) => (
                <div className="flex flex-col p-4 space-y-2">
                  {[
                    { href: "/dashboard", label: "Dashboard" },
                    { href: "/programs", label: "Programs" },
                    { href: "/workouts", label: "Workouts" },
                    { href: "/progress", label: "Progress" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {/* <Link href="/dashboard" className="dropdown-item">
                  Dashboard
                </Link>

                <Link href="/programs" className="dropdown-item">
                  Programs
                </Link>
                <Link href="/workouts" className="dropdown-item">
                  Workouts
                </Link>
                <Link href="/progress" className="dropdown-item">
                  Progress
                </Link> */}
                </div>
              )}
            </AnchoredMenu>
          </div>

          {/* Desktop logo + links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="nav-link absolute left-1/2 transform -translate-x-1/2 md:static md:translate-x-0 font-bold text-xl text-emerald-600 dark:text-emerald-500"
            >
              JAKT
            </Link>

            <div className="hidden md:flex space-x-4">
              {/* <Link href="/" className="nav-link">
              Home
            </Link> */}
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
        </div>

        {/* Center: logo for mobile */}
        <div className="flex justify-center w-1/3 md:hidden">
          <Link
            href="/"
            className="font-bold text-xl text-emerald-600 dark:text-emerald-500"
          >
            JAKT
          </Link>
        </div>

        {/* Right side: user icon middle, auth buttons desktop */}
        <div className="flex justify-end items-center w-1/3 md:w-auto">
          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-500"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile user icon */}
          <div className="md:hidden">
            <AnchoredMenu
              align="right"
              button={
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              }
            >
              {({ closeMenu }) => (
                <div className="flex flex-col p-4 space-y-2">
                    {[
                    { href: "/auth/login", label: "Login" },
                    { href: "/auth/signup", label: "Sign Up" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="dropdown-item"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {/* <Link href="/auth/login" className="dropdown-item">
                    Login
                  </Link>
                  <Link href="/auth/signup" className="dropdown-item">
                    Sign Up
                  </Link> */}
                </div>
              )}
            </AnchoredMenu>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {/* <div
        className={`md:hidden absolute top-full left-0 bg-white rounded-b-md shadow-md dark:bg-gray-800 overflow-hidden transition-all duration-300 ease-out
        ${
          isOpen
            ? "max-h-96 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <div className="space-y-2 px-6 pb-6">
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
          <Link href="/auth/login" className="block nav-link">
            Login
          </Link>
          <Link href="/auth/signup" className="block nav-link">
            Sign Up
          </Link>
        </div>
      </div> */}
    </nav>
  );
};

export default Navbar;
