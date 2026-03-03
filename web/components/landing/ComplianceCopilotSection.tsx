import { CheckCircle2, ShieldCheck } from "lucide-react";
import { COMPLIANCE_BULLETS } from "./constants";
import { SectionLabel } from "./SectionLabel";
import { CheckItem } from "./CheckItem";

const COMPLIANCE_ITEMS = [
  "Import Entry Declaration",
  "BOC Memo Compliance",
  "Missing Docs Alert",
];

export function ComplianceCopilotSection() {
  return (
    <section className="border-t border-white/5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {/* Left — Image placeholder */}
        <div className="flex justify-center lg:justify-start">
          <div className="w-full max-w-md rounded-2xl border border-white/5 bg-[#111827] p-6">
            {/* IMAGE: Replace with a photograph of a shipping port / cargo yard with containers */}
            <div className="flex flex-col items-center gap-4 py-12">
              <ShieldCheck className="h-16 w-16 text-[#3B6CF6]" />
              <p className="text-sm font-medium text-white">
                BOC Regulation Engine
              </p>
              <div className="w-full space-y-2">
                {COMPLIANCE_ITEMS.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2.5"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span className="text-xs text-[#9CA3AF]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — Copy */}
        <div className="max-w-lg">
          <SectionLabel>Compliance Copilot</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            Navigate Philippine Customs with a guide.
          </h2>
          <p className="mt-4 leading-relaxed text-[#9CA3AF]">
            Automatically flag missing documents before filing. Our system stays
            updated with the latest BOC (Bureau of Customs) memos and
            regulations so you&apos;re always one step ahead.
          </p>
          <ul className="mt-6 space-y-3">
            {COMPLIANCE_BULLETS.map((text) => (
              <CheckItem key={text} text={text} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
