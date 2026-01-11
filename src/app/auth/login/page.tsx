import Link from "next/link";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center med:h-screen">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-700 dark:text-gray-300 md:text-2xl mb-6 text-center">
          Welcome back!
        </h1>

        <form className="space-y-6" action="" method="POST">
          <div className="relative">
            <input
              id="signin-email"
              name="email"
              type="email"
              className="peer h-12 w-full border-b-2 border-gray-300 text-gray-700 dark:text-gray-300 placeholder-transparent focus:outline-none focus:border-indigo-600"
              placeholder=" "
            />
            <label
              htmlFor="signin-email"
              className="pointer-events-none absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 dark:peer-focus:text-gray-300 peer-focus:text-sm
              peer-not-placeholder-shown:-top-3.5 peer-not-placeholder-shown:text-gray-600 dark:peer-not-placeholder-shown:text-gray-300 peer-not-placeholder-shown:text-sm"
            >
              Email address
            </label>
          </div>
          <div className="mt-12 relative">
            <input
              id="signin-password"
              name="password"
              type="password"
              className="peer h-12 w-full border-b-2 border-gray-300 text-gray-700 dark:text-gray-300 placeholder-transparent focus:outline-none focus:border-indigo-600"
              placeholder="Your password"
            />
            <label
              htmlFor="signin-password"
              className="pointer-events-none absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 dark:peer-focus:text-gray-300 peer-focus:text-sm
              peer-not-placeholder-shown:-top-3.5 peer-not-placeholder-shown:text-gray-600 dark:peer-not-placeholder-shown:text-gray-300 peer-not-placeholder-shown:text-sm"
            >
              Password
            </label>
          </div>
          <div className="mt-12 relative flex items-center">
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-md  hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
            >
              Sign In
            </button>
          </div>
          <div className="mt-6 relative grid grid-cols-2 text-sm">
            <Link
              href="/auth/change-password"
              className="text-emerald-600 hover:underline justify-self-start"
            >
              Forgot password?
            </Link>
            <Link
              href="/auth/signup"
              className="text-emerald-600 hover:underline justify-self-end text-right">
                Don't have an account?
              </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
