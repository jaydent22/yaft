import Link from "next/link";
import FloatingInput from "../../../components/FloatingInput";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center med:h-screen">
      <div className="w-full max-w-md bg-background rounded-lg shadow-md p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-foreground md:text-2xl mb-6 text-center">
          Welcome back!
        </h1>

        <form className="space-y-6 md:space-y-12" action="" method="POST">
          <FloatingInput
            id="login-email"
            name="email"
            type="email"
            label="Email address"
          />

          <FloatingInput
            id="login-password"
            name="password"
            type="password"
            label="Password"
          />

          <button
            type="submit"
            className="w-full bg-accent text-white py-3 rounded-md hover:bg-accent-hover focus:outline-none active:bg-accent-active"
          >
            Sign In
          </button>

          <div className="grid grid-cols-2 text-sm">
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
