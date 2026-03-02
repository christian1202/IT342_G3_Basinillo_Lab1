"use client";

import { SignIn } from "@clerk/nextjs";

/* ================================================================== */
/*  Login Page                                                         */
/*  Uses Clerk's <SignIn /> component for all authentication:          */
/*    • Email/Password                                                 */
/*    • Google OAuth                                                   */
/*    • Email verification                                             */
/*    • Password reset                                                 */
/*  Configure sign-in methods in the Clerk Dashboard, not here.        */
/* ================================================================== */

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 px-4 py-12 dark:from-slate-950 dark:via-indigo-950/30 dark:to-violet-950/20">
      {/* Decorative background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />
      </div>

      <div className="relative">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl shadow-slate-200/40 dark:shadow-slate-900/40",
            },
          }}
          routing="hash"
          forceRedirectUrl="/dashboard"
        />
      </div>
    </main>
  );
}
