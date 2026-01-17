import Link from "next/link";
import FloatingInput from "../../../components/FloatingInput";
import { signup } from "../actions";

export default function Signup() {
  return (
    <>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-foreground md:text-2xl mb-6 text-center">
        Create an account
      </h1>

      <form className="space-y-6 md:space-y-12" action="" method="POST">
        {/* <FloatingInput
          id="signup-first-name"
          name="firstName"
          label="First Name"
        />
        <FloatingInput
          id="signup-last-name"
          name="lastName"
          label="Last Name"
        /> */}
        <FloatingInput
          id="signup-email"
          name="email"
          type="email"
          label="Email address"
        />

        <FloatingInput
          id="signup-password"
          name="password"
          type="password"
          label="Password"
        />

        <FloatingInput
          id="signup-confirm-password"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
        />

        <button
          type="submit"
          formAction={signup}
          className="w-full bg-accent text-white py-3 rounded-md hover:bg-accent-hover focus:outline-none active:bg-accent-active"
        >
          Sign Up
        </button>

        <div className="text-sm text-center">
          <Link href="/auth/login" className="text-accent hover:underline">
            Already have an account?
          </Link>
        </div>
      </form>
    </>
  );
}
