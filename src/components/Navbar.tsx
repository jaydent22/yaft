import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="font-bold text-xl text-green-600">YAFT</div>
            <div className="space-x-4">
                <Link href="/" className="text-gray-800 hover:text-green-600">Home</Link>
                <Link href="/dashboard" className="text-gray-800 hover:text-green-600">Dashboard</Link>
                <Link href="/programs" className="text-gray-800 hover:text-green-600">Programs</Link>
                <Link href="/workouts" className="text-gray-800 hover:text-green-600">Workouts</Link>
                <Link href="/progress" className="text-gray-800 hover:text-green-600">Progress</Link>
                <Link href="/login" className="text-gray-800 hover:text-green-600">Login</Link>
            </div>
        </nav>
    )
};

export default Navbar;