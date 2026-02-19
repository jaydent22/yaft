"use client";

import Link from "next/link";
import AnchoredMenu from "./AnchoredMenu";
import ThemeToggle from "./ThemeToggle";
import { usePathname } from "next/navigation";
import { type User } from "@supabase/supabase-js";

type NavbarProps = {
  user: User | null;
  profile?: {
    email: string;
    first_name: string;
    last_name: string;
    display_name: string;
  } | null;
}

const Navbar = ({ user, profile }: NavbarProps) => {
  const isLoggedIn = !!user;

  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");
  const isErrorRoute = pathname.startsWith("/error");

  return (
    <nav
      className={`p-2 md:p-4 top-0 z-50 bg-background sticky ${
        isAuthRoute || isErrorRoute
          ? ""
          : "shadow-md border-0 dark:border-b dark:border-border"
      }`}
    >
      <div className="flex items-center md:justify-between">
        {/*Left: burger mobile, logo + nav links desktop */}
        <div className="flex items-center w-1/3 md:w-auto">
          <div
            className={`md:hidden ${
              isAuthRoute || isErrorRoute ? "invisible" : ""
            }`}
          >
            {/* Mobile burger menu */}
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
                    { href: "/workout", label: "Workout" },
                    { href: "/progress", label: "Progress" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="dropdown-item px-2 py-1 rounded-md dropdown-item hover:bg-surface-hover active:bg-surface-active"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </AnchoredMenu>
          </div>

          {/* Desktop logo + links */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Logo always visible */}
            <Link
              href="/"
              className="nav-link absolute left-1/2 transform -translate-x-1/2 md:static md:translate-x-0 font-bold text-xl text-accent"
            >
              JAKT
            </Link>

            {!(isAuthRoute || isErrorRoute) && (
              <div className="hidden md:flex space-x-4">
                {isLoggedIn && (
                  <>
                  {[
                    { href: "/dashboard", label: "Dashboard" },
                    { href: "/programs", label: "Programs" },
                    { href: "/workout", label: "Workout" },
                    { href: "/progress", label: "Progress" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="nav-link text-foreground hover:text-accent active:text-accent-active"
                    >
                      {item.label}
                    </Link>
                  ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center logo for mobile */}
        <div className="flex justify-center w-1/3 md:hidden">
          <Link href="/" className="font-bold text-xl text-accent">
            JAKT
          </Link>
        </div>

        {/* Right side: user icon/auth buttons */}
        <div className="flex justify-end items-center w-1/3 md:w-auto">
          {/* Theme toggle always visible */}
          {!isErrorRoute && (
            <div className="mr-2 md:mr-4">
              <ThemeToggle />
            </div>
          )}
          {/* Desktop auth buttons */}
          {!isLoggedIn && (<div
            className={`hidden items-center space-x-4 ${
              isAuthRoute || isErrorRoute ? "md:hidden" : "md:flex"
            }`}
          >
            <Link
              href="/auth/login"
              className="text-foreground hover:text-accent-hover active:text-accent-active"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-hover active:bg-accent-active"
            >
              Sign Up
            </Link>
          </div>)}

          {/* Logged in & mobile user icon */}
          <div
            className={`${isLoggedIn ? "" : "md:hidden"} ${
              isAuthRoute || isErrorRoute ? "invisible" : ""
            }`}
          >
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
                  {isLoggedIn ? (
                    <>
                      <div className="px-2 py-1 text-foreground">
                        <h1 className="font-semibold">
                          Welcome, {profile?.display_name ||
                            profile?.first_name ||
                            profile?.email ||
                            "User"}
                        </h1>
                      </div>
                      <hr className="border-border" />
                      <Link
                        href="/profile"
                        className="dropdown-item px-2 py-1 rounded-md hover:bg-surface-hover active:bg-surface-active"
                        onClick={closeMenu}
                      >
                        Profile
                      </Link>
                      <hr className="border-border" />
                      <form action="/auth/signout" method="POST">
                        <button
                          type="submit"
                          className="w-full px-2 py-1 rounded-md text-left focus:outline-none hover:bg-red-600 hover:text-white active:bg-red-700"
                        >
                          Sign Out
                        </button>
                      </form>
                    </>
                  ) : (
                    <>
                      {[
                        { href: "/auth/login", label: "Login" },
                        { href: "/auth/signup", label: "Sign Up" },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="dropdown-item hover:text-accent-hover active:text-accent-active"
                          onClick={closeMenu}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              )}
            </AnchoredMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
