import { ArrowRight, ScanLine } from "lucide-react";
import { SectionLabel } from "./SectionLabel";

const SCANNED_DOCUMENTS = [
  "Bill of Lading",
  "Commercial Invoice",
  "Packing List",
];

export function SmartScanSection() {
  return (
    <section className="border-t border-white/5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {/* Left — Copy */}
        <div className="max-w-lg">
          <SectionLabel>Smart Scan AI</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            Digitize chaos into structured data instantly.
          </h2>
          <p className="mt-4 leading-relaxed text-[#9CA3AF]">
            Stop manual data entry. Upload Bills of Lading, Commercial Invoices,
            and Packing Lists — our OCR technology extracts every key data point
            at 99.8% accuracy and maps it directly into your workflow.
          </p>
          <a
            href="#"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#3B6CF6] transition-colors hover:text-[#5b8af8]"
          >
            Explore AI Capabilities
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Right — Image placeholder */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-2xl border border-white/5 bg-[#111827] p-6">
            {/* IMAGE: Replace with a photograph of someone working at a desk with documents and a laptop screen showing structured data */}
            <div className="flex flex-col items-center gap-4 py-12">
              <ScanLine className="h-16 w-16 text-[#3B6CF6]" />
              <p className="text-sm font-medium text-white">
                AI Document Processing
              </p>
              <div className="w-full space-y-2">
                {SCANNED_DOCUMENTS.map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2.5"
                  >
                    <span className="text-xs text-[#9CA3AF]">{doc}</span>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                      99.8% match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
