import { Clock } from "lucide-react";
import { DEMURRAGE_BULLETS } from "./constants";
import { SectionLabel } from "./SectionLabel";
import { CheckItem } from "./CheckItem";

export function DemurrageClockSection() {
  return (
    <section id="features" className="border-t border-white/5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {/* Left — Mockup */}
        <div className="flex justify-center lg:justify-start">
          <div className="w-full max-w-sm rounded-2xl border border-white/5 bg-[#111827] p-6">
            {/* IMAGE: Replace this placeholder with a stylized clock / countdown timer UI illustration */}
            <div className="flex flex-col items-center gap-4 py-8">
              <Clock className="h-16 w-16 text-[#3B6CF6]" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                Time Remaining
              </p>
              <p className="font-mono text-5xl font-black text-white">
                48<span className="text-[#3B6CF6]">:</span>00
                <span className="text-[#3B6CF6]">:</span>00
              </p>
              <div className="mt-2 flex gap-4 text-[10px] text-[#9CA3AF]">
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-400">
                  48h Alert
                </span>
                <span className="rounded bg-amber-500/10 px-2 py-0.5 text-amber-400">
                  24h Alert
                </span>
                <span className="rounded bg-red-500/10 px-2 py-0.5 text-red-400">
                  12h Alert
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Copy */}
        <div className="max-w-lg">
          <SectionLabel>Demurrage Clock</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            Stop paying for delays you didn&apos;t see coming.
          </h2>
          <p className="mt-4 leading-relaxed text-[#9CA3AF]">
            Our predictive engine calculates free time expiry for every
            container. Get automatic 48-hour, 24-hour, and 12-hour alerts before
            demurrage kicks in — so your team can act, not react.
          </p>
          <ul className="mt-6 space-y-3">
            {DEMURRAGE_BULLETS.map((text) => (
              <CheckItem key={text} text={text} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
