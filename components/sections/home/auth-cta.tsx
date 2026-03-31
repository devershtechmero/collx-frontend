"use client";

import { useClerk } from "@clerk/nextjs";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { GoogleAuthButton } from "@/components/shared/auth/google-auth-button";
import { useAuth } from "@/lib/hooks/use-auth";

type AuthMode = "register" | "login" | "forgot-password";
type SignupStep = "form" | "verify";
type LoginStep = "form" | "verify";
type ForgotPasswordStep = "email" | "verify" | "reset" | "success";

const OTP_LENGTH = 8;

function getClerkErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Unable to continue with Google right now.";
}

export function AuthCta() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("register");
  const [signupStep, setSignupStep] = useState<SignupStep>("form");
  const [loginStep, setLoginStep] = useState<LoginStep>("form");
  const [forgotPasswordStep, setForgotPasswordStep] =
    useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    login,
    verifyLogin,
    signup,
    verifySignup,
    startForgotPassword,
    verifyForgotPassword,
    resetPassword,
  } = useAuth();
  const clerk = useClerk();

  function resetAuthState() {
    setSignupStep("form");
    setLoginStep("form");
    setForgotPasswordStep("email");
    setEmail("");
    setPassword("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setPreviewOtp(null);
    setResetToken(null);
    setIsSubmitting(false);
  }

  function openRegisterPopup() {
    setAuthMode("register");
    resetAuthState();
    setIsAuthOpen(true);
  }

  function openLoginPopup() {
    setAuthMode("login");
    resetAuthState();
    setIsAuthOpen(true);
  }

  function openForgotPasswordPopup() {
    setAuthMode("forgot-password");
    resetAuthState();
    setIsAuthOpen(true);
  }

  const closeAuthPopup = useCallback(() => {
    setIsAuthOpen(false);
    setAuthMode("register");
    resetAuthState();
  }, []);

  useEffect(() => {
    if (!isAuthOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isAuthOpen]);

  useEffect(() => {
    if (!isAuthOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeAuthPopup();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [closeAuthPopup, isAuthOpen]);

  async function handleGoogleAuth() {
    if (!clerk.client) {
      toast.error("Google sign in is not ready yet.");
      return;
    }

    try {
      setIsSubmitting(true);
      const authResource =
        authMode === "register" ? clerk.client.signUp : clerk.client.signIn;

      await authResource.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
        continueSignUp: true,
        continueSignIn: true,
      });
    } catch (error) {
      toast.error(getClerkErrorMessage(error));
      setIsSubmitting(false);
    }
  }

  async function handleCreateAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await signup(email, password);
      setOtp("");
      setPreviewOtp(response.previewOtp || null);
      setSignupStep("verify");
      toast.success("Signup OTP sent to your email.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCompleteSignup() {
    if (!isSignupOtpComplete) {
      return;
    }

    try {
      setIsSubmitting(true);
      await verifySignup(email, otp);
      closeAuthPopup();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to verify OTP.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await login(email, password);

      if (response) {
        setOtp("");
        setPreviewOtp(response.previewOtp || null);
        setLoginStep("verify");
        toast.success("Login OTP sent to your email.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCompleteLogin() {
    if (otp.length !== OTP_LENGTH) {
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await verifyLogin(email, otp);

      if (success) {
        closeAuthPopup();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOtpChange(event: React.ChangeEvent<HTMLInputElement>) {
    setOtp(event.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH));
  }

  async function handleForgotPasswordEmailSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!email) {
      toast.error("Email is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await startForgotPassword(email);
      setOtp("");
      setPreviewOtp(response.previewOtp || null);
      setForgotPasswordStep("verify");
      toast.success("OTP sent for password reset.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send OTP.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleForgotPasswordOtpSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (otp.length !== OTP_LENGTH) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await verifyForgotPassword(email, otp);
      setResetToken(response.resetToken);
      setForgotPasswordStep("reset");
      toast.success("OTP verified.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to verify OTP.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleForgotPasswordResetSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!passwordsMatch || !resetToken) {
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword(email, newPassword, resetToken);
      setForgotPasswordStep("success");
      setPreviewOtp(null);
      setResetToken(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSignupOtpComplete = otp.length === OTP_LENGTH;
  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  return (
    <>
      <section className="mx-auto w-full mt-2 max-w-full pb-10">
        <div className="overflow-hidden rounded-xl border-current/15 bg-background px-6 py-4 text-foreground sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-2">
              {/* <p className="text-sm font-medium text-foreground/70">
                Join Coll X
              </p> */}
              <h2 className="text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
                Register now and start building your community.
              </h2>
              <p className="text-sm text-foreground/80 sm:text-xm">
                Create your account in minutes, or log in to continue where you
                left off.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openRegisterPopup}
                className="inline-flex items-center justify-center rounded-full border border-current px-6 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:cursor-pointer hover:bg-foreground/8"
              >
                Register Now
              </button>

              <button
                type="button"
                onClick={openLoginPopup}
                className="inline-flex items-center justify-center rounded-full border border-current px-6 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:cursor-pointer hover:bg-foreground/8"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {isAuthOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <button
            type="button"
            aria-label="Close auth popup"
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={closeAuthPopup}
          />

          <div className="relative z-10 w-full max-w-md rounded-xl border border-current/15 bg-background px-6 pb-6 pt-16 text-foreground shadow-[0_25px_100px_-35px_rgba(0,0,0,0.7)] sm:px-8 sm:pb-8 sm:pt-18">
            <button
              type="button"
              aria-label="Close auth popup"
              onClick={closeAuthPopup}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/15 transition-colors duration-200 hover:bg-foreground/8"
            >
              <X className="h-5 w-5 hover:cursor-pointer" />
            </button>

            {authMode === "register" && signupStep === "form" ? (
              <>
                <div className="pr-12">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                    Get started
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/70">
                    By continue, you agree to our policy and user agreement.
                  </p>
                </div>

                <GoogleAuthButton
                  label={isSubmitting ? "Connecting..." : "Continue with Google"}
                  className="mt-6"
                  disabled={isSubmitting}
                  onClick={handleGoogleAuth}
                />

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
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-full border border-current/30 px-5 py-3 text-sm font-semibold text-foreground transition-transform duration-200 hover:cursor-pointer hover:bg-foreground/8"
                  >
                    {isSubmitting ? "Sending OTP..." : "Create account"}
                  </button>
                </form>

                <p className="mt-5 text-center text-sm">
                  Already have an account ?{" "}
                  <button
                    type="button"
                    onClick={openLoginPopup}
                    className="font-semibold text-foreground underline underline-offset-4 hover:cursor-pointer"
                  >
                    Login
                  </button>
                </p>
              </>
            ) : null}

            {authMode === "register" && signupStep === "verify" ? (
              <div className="space-y-5 pt-4">
                <div className="rounded-2xl border border-current/15 bg-foreground/4 px-4 py-4">
                  <h4 className="text-lg font-semibold">Verify your account</h4>
                  <p className="mt-2 text-sm leading-6 text-foreground/70">
                    We sent an 8 digit OTP to{" "}
                    <span className="font-semibold text-foreground">
                      {email}
                    </span>
                    . Enter it below to complete signup.
                  </p>
                </div>
                {previewOtp ? (
                  <p className="rounded-2xl border border-current/15 bg-foreground/4 px-4 py-3 text-sm text-foreground/70">
                    Development OTP: <span className="font-semibold text-foreground">{previewOtp}</span>
                  </p>
                ) : null}

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
                  onClick={handleCompleteSignup}
                  disabled={!isSignupOtpComplete}
                  className="inline-flex w-full items-center justify-center rounded-full border border-current/30 px-5 py-3 text-sm font-semibold text-foreground transition-transform duration-200 hover:bg-foreground/8 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {isSubmitting ? "Verifying..." : "Complete sign up"}
                </button>
              </div>
            ) : null}

            {authMode === "login" && loginStep === "form" ? (
              <>
                <div className="pr-12">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                    Welcome back
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/70">
                    Log in to continue your collection workflow and pick up
                    where you left off.
                  </p>
                </div>

                <GoogleAuthButton
                  label={isSubmitting ? "Connecting..." : "Continue with Google"}
                  className="mt-6"
                  disabled={isSubmitting}
                  onClick={handleGoogleAuth}
                />

                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-current/15" />
                  <span className="text-xs font-medium uppercase tracking-[0.22em] text-foreground/55">
                    Or
                  </span>
                  <div className="h-px flex-1 bg-current/15" />
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
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
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-foreground/75">
                        Password
                      </span>
                      <button
                        type="button"
                        onClick={openForgotPasswordPopup}
                        className="text-xs font-medium text-foreground/60 underline underline-offset-4 hover:cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
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
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-full border border-current/30 px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-foreground/8"
                  >
                    {isSubmitting ? "Sending OTP..." : "Login"}
                  </button>
                </form>

                <p className="mt-5 text-center text-sm text-foreground/72">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={openRegisterPopup}
                    className="font-semibold text-foreground underline underline-offset-4 hover:cursor-pointer"
                  >
                    Register now
                  </button>
                </p>
              </>
            ) : null}

            {authMode === "login" && loginStep === "verify" ? (
              <div className="space-y-5 pt-4">
                <div className="rounded-2xl border border-current/15 bg-foreground/4 px-4 py-4">
                  <h4 className="text-lg font-semibold">Verify your login</h4>
                  <p className="mt-2 text-sm leading-6 text-foreground/70">
                    We sent an 8 digit OTP to{" "}
                    <span className="font-semibold text-foreground">
                      {email}
                    </span>
                    . Enter it below to continue to your dashboard.
                  </p>
                </div>
                {previewOtp ? (
                  <p className="rounded-2xl border border-current/15 bg-foreground/4 px-4 py-3 text-sm text-foreground/70">
                    Development OTP: <span className="font-semibold text-foreground">{previewOtp}</span>
                  </p>
                ) : null}

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
                  onClick={handleCompleteLogin}
                  disabled={otp.length !== OTP_LENGTH || isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-full border border-current/30 px-5 py-3 text-sm font-semibold text-foreground transition-transform duration-200 hover:bg-foreground/8 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {isSubmitting ? "Verifying..." : "Verify and continue"}
                </button>
              </div>
            ) : null}

            {authMode === "forgot-password" && forgotPasswordStep === "email" ? (
              <>
                <div className="pr-12">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                    Forgot password
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/70">
                    Enter your email and we&apos;ll send an OTP for
                    password recovery.
                  </p>
                </div>

                <form
                  className="mt-6 space-y-4"
                  onSubmit={handleForgotPasswordEmailSubmit}
                >
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-full border border-current/30 px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-foreground/8"
                  >
                    {isSubmitting ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              </>
            ) : null}

            {authMode === "forgot-password" &&
            forgotPasswordStep === "verify" ? (
              <>
                <div className="pr-12">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                    OTP verification
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/70">
                    We sent an 8 digit OTP to{" "}
                    <span className="font-semibold text-foreground">
                      {email}
                    </span>
                    .
                  </p>
                </div>
                {previewOtp ? (
                  <p className="rounded-2xl border border-current/15 bg-foreground/4 px-4 py-3 text-sm text-foreground/70">
                    Development OTP: <span className="font-semibold text-foreground">{previewOtp}</span>
                  </p>
                ) : null}

                <form
                  className="mt-6 space-y-4"
                  onSubmit={handleForgotPasswordOtpSubmit}
                >
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-foreground/75">
                      OTP
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={OTP_LENGTH}
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="Enter 8 digit OTP"
                      className="w-full rounded-2xl border border-current/15 bg-background px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-foreground/40 focus:border-current/35"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={otp.length !== OTP_LENGTH || isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-full border border-current/30 px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-foreground/8 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                  </button>
                </form>
              </>
            ) : null}

            {authMode === "forgot-password" &&
            forgotPasswordStep === "reset" ? (
              <>
                <div className="pr-12">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                    Set new password
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/70">
                    Create a new password for{" "}
                    <span className="font-semibold text-foreground">
                      {email}
                    </span>
                    .
                  </p>
                </div>

                <form
                  className="mt-6 space-y-4"
                  onSubmit={handleForgotPasswordResetSubmit}
                >
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-foreground/75">
                      New password
                    </span>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="Enter new password"
                      className="w-full rounded-2xl border border-current/15 bg-background px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-foreground/40 focus:border-current/35"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-foreground/75">
                      Confirm new password
                    </span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Confirm new password"
                      className="w-full rounded-2xl border border-current/15 bg-background px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-foreground/40 focus:border-current/35"
                    />
                  </label>

                  {!passwordsMatch && confirmPassword.length > 0 ? (
                    <p className="text-sm text-foreground/65">
                      New password and confirm password must match.
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={!passwordsMatch || isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-full border border-current/30 px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-foreground/8 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {isSubmitting ? "Updating..." : "Update password"}
                  </button>
                </form>
              </>
            ) : null}

            {authMode === "forgot-password" &&
            forgotPasswordStep === "success" ? (
              <div className="space-y-5">
                <div className="pr-12">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                    Password updated
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/70">
                    Your password has been reset successfully. You can now log
                    in with your new password.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openLoginPopup}
                  className="inline-flex w-full items-center justify-center rounded-full border border-current/30 px-5 py-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-foreground/8"
                >
                  Go to login
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
