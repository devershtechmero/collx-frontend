"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type SignupStep = "form" | "verify";

const OTP_LENGTH = 8;

export function AuthCta() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [signupStep, setSignupStep] = useState<SignupStep>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  function closeRegisterPopup() {
    setIsRegisterOpen(false);
    setSignupStep("form");
    setEmail("");
    setPassword("");
    setOtp("");
  }

  useEffect(() => {
    if (!isRegisterOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isRegisterOpen]);

  useEffect(() => {
    if (!isRegisterOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeRegisterPopup();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isRegisterOpen]);

  function handleCreateAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      return;
    }

    setOtp("");
    setSignupStep("verify");
  }

  function handleOtpChange(event: React.ChangeEvent<HTMLInputElement>) {
    setOtp(event.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH));
  }

  const isOtpComplete = otp.length === OTP_LENGTH;

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-12 lg:px-12">
        <div className="overflow-hidden rounded-4xl border border-current/15 bg-background px-6 py-8 text-foreground sm:px-8 sm:py-10 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-medium text-foreground/70">
                Join Coll X
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                Register now and start building your community.
              </h2>
              <p className="text-sm text-foreground/80 sm:text-base">
                Create your account in minutes, or log in to continue where you
                left off.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className="inline-flex items-center justify-center rounded-full border border-current/30 px-6 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:cursor-pointer hover:bg-foreground/8"
              >
                Register Now
              </button>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-current/30 px-6 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-foreground/8"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {isRegisterOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <button
            type="button"
            aria-label="Close register popup"
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={closeRegisterPopup}
          />

          <div className="relative z-10 w-full max-w-md rounded-xl border border-current/15 bg-background px-6 pb-6 pt-16 text-foreground shadow-[0_25px_100px_-35px_rgba(0,0,0,0.7)] sm:px-8 sm:pb-8 sm:pt-18">
            <button
              type="button"
              aria-label="Close register popup"
              onClick={closeRegisterPopup}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/15 transition-colors duration-200 hover:bg-foreground/8"
            >
              <X className="h-5 w-5 hover:cursor-pointer" />
            </button>

            {signupStep === "form" ? (
              <>
                <div className="pr-12">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                    Get started
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/70">
                    By continue, you agree to our policy and user agreement.
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-current/15 px-4 py-3 text-sm font-semibold transition-colors duration-200 hover:cursor-pointer hover:bg-foreground/6"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                  >
                    <path
                      fill="#4285F4"
                      d="M21.35 11.1H12v2.98h5.36c-.23 1.51-1.73 4.43-5.36 4.43a5.97 5.97 0 0 1 0-11.94c2.07 0 3.45.88 4.24 1.63l2.9-2.8C17.3 3.69 14.92 2.5 12 2.5a9.5 9.5 0 1 0 0 19c5.48 0 9.12-3.85 9.12-9.28 0-.63-.07-.9-.15-1.12Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 21.5c2.6 0 4.79-.86 6.38-2.33l-3.05-2.36c-.82.56-1.88.95-3.33.95-2.56 0-4.73-1.73-5.5-4.06H3.35v2.54A9.5 9.5 0 0 0 12 21.5Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M6.5 13.7A5.72 5.72 0 0 1 6.2 12c0-.59.1-1.16.28-1.7V7.77H3.35a9.5 9.5 0 0 0 0 8.46L6.5 13.7Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 6.24c1.45 0 2.75.5 3.78 1.5l2.84-2.76C16.78 3.3 14.6 2.5 12 2.5a9.5 9.5 0 0 0-8.65 5.27l3.13 2.53c.76-2.33 2.94-4.06 5.52-4.06Z"
                    />
                  </svg>
                  Continue with Google
                </button>

                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-current/15" />
                  <span className="text-xs font-medium uppercase tracking-[0.22em] text-foreground/55">
                    Or
                  </span>
                  <div className="h-px flex-1 bg-current/15" />
                </div>

                <form className="space-y-4" onSubmit={handleCreateAccount}>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-foreground/75">
                      Email
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-2xl border border-current/15 bg-background px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-foreground/40 focus:border-current/35"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-foreground/75">
                      Password
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-current/15 bg-background px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-foreground/40 focus:border-current/35"
                    />
                  </label>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-full border border-current/30 px-5 py-3 text-sm font-semibold text-foreground transition-transform duration-200 hover:cursor-pointer hover:bg-foreground/8"
                  >
                    Create account
                  </button>
                </form>

                <p className="mt-5 text-center text-sm">
                  Already have an account ?{" "}
                  <Link href="/login" className="">
                    Login
                  </Link>
                </p>
              </>
            ) : null}

            {signupStep === "verify" ? (
              <div className="space-y-5 pt-4">
                <div className="rounded-2xl border border-current/15 bg-foreground/4 px-4 py-4">
                  <h4 className="text-lg font-semibold">Verify your account</h4>
                  <p className="mt-2 text-sm leading-6 text-foreground/70">
                    We simulated sending an 8 digit OTP to{" "}
                    <span className="font-semibold text-foreground">
                      {email}
                    </span>
                    . Enter it below to complete signup.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium text-foreground/75">
                    8 digit OTP
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={OTP_LENGTH}
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter 8 digit OTP"
                    aria-label="8 digit OTP"
                    className="w-full rounded-2xl border border-current/15 bg-background px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-foreground/40 focus:border-current/35"
                  />
                </div>

                <button
                  type="button"
                  disabled={!isOtpComplete}
                  className="inline-flex w-full items-center justify-center rounded-full border border-current/30 px-5 py-3 text-sm font-semibold text-foreground transition-transform duration-200 hover:bg-foreground/8 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Complete sign up
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
