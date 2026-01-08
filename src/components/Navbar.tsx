import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md dark:bg-gray-800 p-4 flex justify-between items-center">
            <div className="font-bold text-xl text-emerald-600 dark:text-emerald-500">YAFT</div>
            <div className="space-x-4">
                <Link href="/" className="text-gray-800 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-500">Home</Link>
                <Link href="/dashboard" className="text-gray-800 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-500">Dashboard</Link>
                <Link href="/programs" className="text-gray-800 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-500">Programs</Link>
                <Link href="/workouts" className="text-gray-800 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-500">Workouts</Link>
                <Link href="/progress" className="text-gray-800 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-500">Progress</Link>
                <Link href="/login" className="text-gray-800 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-500">Login</Link>
            </div>
        </nav>
    )
};

export default Navbar;