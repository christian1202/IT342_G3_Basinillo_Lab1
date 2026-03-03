import Link from "next/link";
import { PlayCircle } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#3B6CF6]/10 blur-[120px]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left — Copy */}
        <div className="max-w-xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <span className="text-xs font-medium text-[#9CA3AF]">
              Live Port Tracking for Philippines
            </span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Automate Customs.{" "}
            <span className="bg-gradient-to-r from-[#3B6CF6] to-[#6D5BF7] bg-clip-text text-transparent">
              Zero&nbsp;Demurrage.
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-[#9CA3AF]">
            PortKey&apos;s AI-powered platform predicts delays, automates
            compliance documents, and tracks shipments in real-time so you never
            pay demurrage fees again.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/auth/sign-up"
              className="rounded-full bg-[#3B6CF6] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-[#2b5ad4] hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
            >
              Start Free Trial
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              <PlayCircle className="h-4 w-4" />
              See How It Works
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-[#0A0F1E] bg-gradient-to-br from-slate-600 to-slate-500"
                  title={`User avatar ${i}`}
                />
              ))}
            </div>
            <span className="text-xs text-[#9CA3AF]">
              Trusted by logistics teams at{" "}
              <span className="font-medium text-white/60">
                leading PH forwarders
              </span>
            </span>
          </div>
        </div>

        {/* Right — Dashboard Mockup */}
        <div className="relative flex justify-center lg:justify-end">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard Mockup (hero right-side card)                             */
/* ------------------------------------------------------------------ */

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-2xl shadow-blue-500/5">
      {/* Glow ring */}
      <div className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-[#3B6CF6]/20 to-transparent blur-sm" />

      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
          Live Status / Pull Info
        </span>
      </div>

      {/* Demurrage Conditions */}
      <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
          Demurrage Conditions
        </p>
        <p className="mt-2 font-mono text-3xl font-black text-red-500">
          04:12:00
        </p>
        <p className="mt-1 text-[10px] text-red-400/70">
          Free time expiring soon
        </p>
      </div>

      {/* Container Status */}
      <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
          Container Status
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-sm font-medium text-white">
            At Port — Gate In
          </span>
        </div>
      </div>

      {/* Bill of Lading */}
      <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
          Bill of Lading #SG821
        </p>
        <div className="mt-2 space-y-1.5 text-xs text-[#9CA3AF]">
          <div className="flex justify-between">
            <span>Container</span>
            <span className="font-medium text-white">MSCU-4817293</span>
          </div>
          <div className="flex justify-between">
            <span>Vessel</span>
            <span className="font-medium text-white">MV Pacific Star</span>
          </div>
          <div className="flex justify-between">
            <span>ETA Manila</span>
            <span className="font-medium text-white">Mar 05, 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
