import Link from "next/link";
import {
  Anchor,
  Truck,
  BarChart3,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

/* ================================================================== */
/*  Landing Page (Root)                                                */
/*  Modern, dark-mode friendly landing page with Hero & Features.      */
/*  Replaces the default redirect to /login.                           */
/* ================================================================== */

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* ============================================================ */}
      {/*  Header                                                      */}
      {/* ============================================================ */}
      <header className="fixed top-0 z-50 w-full border-b border-transparent bg-white/50 backdrop-blur-md transition-colors dark:bg-slate-950/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30">
              <Anchor className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              PortKey
            </span>
          </div>

          {/* Nav Actions */}
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* ============================================================ */}
      {/*  Main Content                                                */}
      {/* ============================================================ */}
      <main className="flex-1">
        {/* ---- Hero Section ---- */}
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
          {/* Decorative Blobs */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/2 -ml-[40rem] h-[40rem] w-[80rem] -translate-y-1/2 opacity-20 bg-gradient-to-tr from-indigo-500 to-violet-500 blur-3xl dark:opacity-10 sm:left-1/2 sm:opacity-30" />
            <div className="absolute bottom-0 right-1/2 -mr-[40rem] h-[40rem] w-[80rem] translate-y-1/2 opacity-20 bg-gradient-to-tr from-cyan-400 to-blue-500 blur-3xl dark:opacity-10 sm:right-1/2 sm:opacity-30" />
          </div>

          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Next-Gen Logistics</span>
              <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                Management
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400 sm:text-xl">
              Track shipments, manage inventory, and analyze performance in
              real-time. The smartest way to streamline your supply chain.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white shadow-xl transition-all hover:bg-slate-800 hover:scale-105 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ---- Features Grid ---- */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="group rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md dark:bg-slate-900 dark:shadow-slate-800/50">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Real-time Tracking
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Monitor cargo status across the globe with live updates and
                  instant notifications for every milestone.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md dark:bg-slate-900 dark:shadow-slate-800/50">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white dark:bg-violet-900/30 dark:text-violet-400">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Analytics Dashboard
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Visualize your supply chain performance with powerful charts
                  and key metrics at a glance.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md dark:bg-slate-900 dark:shadow-slate-800/50">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/30 dark:text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Secure Data
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Enterprise-grade security featuring encrypted document storage
                  and granular access controls.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/*  Footer                                                      */}
      {/* ============================================================ */}
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p>© 2026 PortKey Logistics. All rights reserved.</p>
      </footer>
    </div>
  );
}
