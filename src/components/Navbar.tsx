import Link from "next/link";

const Navbar = () => {
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
