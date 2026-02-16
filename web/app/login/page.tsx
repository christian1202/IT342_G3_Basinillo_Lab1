"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  LogIn,
  UserPlus,
  Chrome,
  Eye,
  EyeOff,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { syncUserWithBackend } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type Tab = "login" | "register";

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */
export default function LoginPage() {
  const router = useRouter();

  /* ---- core state ---- */
  const [activeTab, setActiveTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  /* ---- new UX state ---- */
  const [isConfirmationPending, setIsConfirmationPending] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  /* ---- resend cooldown timer ---- */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  /* ---- helpers ---- */
  const resetForm = useCallback(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setFieldErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, []);

  const switchTab = useCallback(
    (tab: Tab) => {
      resetForm();
      setActiveTab(tab);
    },
    [resetForm],
  );

  /* ---- validate ---- */
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    const cleanEmail = email.trim();
    if (!cleanEmail) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
      errs.email = "Enter a valid email";

    if (!password) errs.password = "Password is required";
    else if (password.length < 6)
      errs.password = "Must be at least 6 characters";

    if (activeTab === "register") {
      if (!confirmPassword)
        errs.confirmPassword = "Please confirm your password";
      else if (password !== confirmPassword)
        errs.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ---- auth handlers ---- */
  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setError(null);

    /* ✅ Sanitize input */
    const cleanEmail = email.trim();
    const cleanPassword = password; // never trim passwords

    try {
      const { data, error: authError } =
        activeTab === "login"
          ? await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password: cleanPassword,
            })
          : await supabase.auth.signUp({
              email: cleanEmail,
              password: cleanPassword,
            });

      if (authError) throw authError;

      if (data.session) {
        /* Login succeeded (or signup auto-confirmed) */
        await syncUserWithBackend(data.session);
        router.refresh(); // re-run proxy with fresh cookies
        router.push("/dashboard");
      } else if (activeTab === "register" && data.user && !data.session) {
        /* ✅ Signup succeeded but email confirmation is required */
        setConfirmationEmail(cleanEmail);
        setIsConfirmationPending(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });

      if (authError) throw authError;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google login failed");
      setIsGoogleLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: confirmationEmail,
      });
      if (resendError) throw resendError;
      setResendCooldown(60);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend email");
    }
  };

  /* ---- password toggle button helper ---- */
  const passwordToggle = (visible: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      tabIndex={-1}
      aria-label={visible ? "Hide password" : "Show password"}
    >
      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  /* ================================================================== */
  /*  RENDER — "Check Your Inbox" card                                   */
  /* ================================================================== */
  if (isConfirmationPending) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 dark:from-slate-950 dark:via-indigo-950/30 dark:to-violet-950/20 px-4 py-12">
        {/* decorative blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-lg dark:border-slate-700/60 dark:bg-slate-900/80 dark:shadow-slate-900/40 text-center">
            {/* mail icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30">
              <Mail className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Check your inbox
            </h2>

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              We sent a confirmation link to{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {confirmationEmail}
              </span>
              . Click the link to activate your account.
            </p>

            {/* error (e.g. resend failure) */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
                {error}
              </div>
            )}

            {/* resend button */}
            <button
              onClick={handleResendEmail}
              disabled={resendCooldown > 0}
              className={`mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                resendCooldown > 0
                  ? "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                  : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:hover:bg-indigo-950/80"
              }`}
            >
              <RefreshCw
                className={`h-4 w-4 ${resendCooldown > 0 ? "" : "group-hover:rotate-180 transition-transform"}`}
              />
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend Confirmation Email"}
            </button>

            {/* back to login */}
            <button
              onClick={() => {
                setIsConfirmationPending(false);
                setError(null);
                switchTab("login");
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ================================================================== */
  /*  RENDER — Login / Register form                                     */
  /* ================================================================== */
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 dark:from-slate-950 dark:via-indigo-950/30 dark:to-violet-950/20 px-4 py-12">
      {/* ---- decorative blobs ---- */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* ---- branding ---- */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30">
            <LogIn className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Shipment Inventory
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign in to manage your shipments
          </p>
        </div>

        {/* ---- card ---- */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-lg dark:border-slate-700/60 dark:bg-slate-900/80 dark:shadow-slate-900/40">
          {/* ---- tabs ---- */}
          <div className="mb-6 flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {(["login", "register"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                }`}
              >
                {tab === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          {/* ---- error alert ---- */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
              {error}
            </div>
          )}

          {/* ---- form ---- */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              autoComplete="email"
            />

            {/* password with visibility toggle */}
            <div>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password}
                autoComplete={
                  activeTab === "login" ? "current-password" : "new-password"
                }
                rightElement={passwordToggle(showPassword, () =>
                  setShowPassword((p) => !p),
                )}
              />
              {/* live password feedback (register only) */}
              {activeTab === "register" &&
                password.length > 0 &&
                password.length < 6 && (
                  <p className="mt-1.5 text-xs font-medium text-amber-500 dark:text-amber-400">
                    Password must be at least 6 characters
                  </p>
                )}
            </div>

            {/* confirm password with visibility toggle */}
            {activeTab === "register" && (
              <Input
                label="Confirm password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={fieldErrors.confirmPassword}
                autoComplete="new-password"
                rightElement={passwordToggle(showConfirmPassword, () =>
                  setShowConfirmPassword((p) => !p),
                )}
              />
            )}

            <Button type="submit" isLoading={isLoading} className="mt-2">
              {activeTab === "login" ? (
                <>
                  <LogIn className="h-4 w-4" /> Sign In
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" /> Create Account
                </>
              )}
            </Button>
          </form>

          {/* ---- divider ---- */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs font-medium text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* ---- google ---- */}
          <Button
            variant="outline"
            isLoading={isGoogleLoading}
            onClick={handleGoogleLogin}
          >
            <Chrome className="h-4 w-4" /> Continue with Google
          </Button>
        </div>

        {/* ---- footer ---- */}
        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          By continuing you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
