import Link from "next/link";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center med:h-screen">
      <div className="w-full max-w-md bg-background rounded-lg shadow-md p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-foreground md:text-2xl mb-6 text-center">
          Welcome back!
        </h1>

        <form className="space-y-6" action="" method="POST">
          <div className="relative">
            <input
              id="signin-email"
              name="email"
              type="email"
              className="peer h-12 w-full border-b-2 border-border text-foreground placeholder-transparent focus:outline-none focus:border-accent"
              placeholder=" "
            />
            <label
              htmlFor="signin-email"
              className="pointer-events-none absolute left-0 -top-3.5 text-foreground-muted text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-foregroud-muted peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-foreground peer-focus:text-sm
              peer-not-placeholder-shown:-top-3.5 peer-not-placeholder-shown:text-foreground-muted peer-not-placeholder-shown:text-sm"
            >
              Email address
            </label>
          </div>
          <div className="mt-12 relative">
            <input
              id="signin-password"
              name="password"
              type="password"
              className="peer h-12 w-full border-b-2 border-border text-foreground placeholder-transparent focus:outline-none focus:border-accent"
              placeholder=" "
            />
            <label
              htmlFor="signin-password"
              className="pointer-events-none absolute left-0 -top-3.5 text-foreground-muted text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-foreground-muted peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-foreground peer-focus:text-sm
              peer-not-placeholder-shown:-top-3.5 peer-not-placeholder-shown:text-foreground-muted peer-not-placeholder-shown:text-sm"
            >
              Password
            </label>
          </div>
          <div className="mt-12 relative flex items-center">
            <button
              type="submit"
              className="w-full bg-accent text-white py-3 rounded-md hover:bg-accent-hover focus:outline-none active:bg-accent-active"
            >
              Sign In
            </button>
          </div>
          <div className="mt-6 relative grid grid-cols-2 text-sm">
            <Link
              href="/auth/change-password"
              className="text-accent hover:underline justify-self-start"
            >
              Forgot password?
            </Link>
            <Link
              href="/auth/signup"
              className="text-accent hover:underline justify-self-end text-right"
            >
              Don&apos;t have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
