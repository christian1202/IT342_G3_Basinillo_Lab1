import { Anchor, Star } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full font-sans text-white">
      {/* Left Pane - Branding Info */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0B1120] p-12 lg:flex">
        {/* Subtle Background Overlay */}
        <div
          className="absolute inset-0 z-0 bg-gradient-to-br from-[#0B1120]/80 to-[#0B1120] bg-cover bg-center bg-no-repeat opacity-[0.80] mix-blend-overlay"
          style={{
            backgroundImage: "url('/pictures/ocean-freight-shipping.png')",
          }}
        ></div>

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3B82F6] text-white shadow-lg">
            <Anchor size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight">PortKey</span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col justify-center gap-6 mt-12 mb-8 xl:mt-0 xl:mb-0">
          <h1 className="text-4xl font-bold leading-tight xl:text-5xl text-white">
            Secure Customs <br /> Clearance Management
          </h1>
          <p className="max-w-md text-lg text-slate-400">
            Track demurrage, automate filings, and optimize your logistics with
            AI-powered insights tailored for the Philippines.
          </p>

          {/* Carousel Indicators & Progress */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-[#3B82F6]"></div>
              <div className="h-2 w-2 rounded-full bg-slate-700"></div>
              <div className="h-2 w-2 rounded-full bg-slate-700"></div>
            </div>
            <div className="h-px w-32 bg-slate-800">
              <div className="h-full w-1/3 bg-[#3B82F6]"></div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof & Footer */}
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img
                  className="h-10 w-10 rounded-full border-2 border-[#0B1120]"
                  src="https://i.pravatar.cc/100?img=1"
                  alt="User 1"
                />
                <img
                  className="h-10 w-10 rounded-full border-2 border-[#0B1120]"
                  src="https://i.pravatar.cc/100?img=2"
                  alt="User 2"
                />
                <img
                  className="h-10 w-10 rounded-full border-2 border-[#0B1120]"
                  src="https://i.pravatar.cc/100?img=3"
                  alt="User 3"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex text-yellow-500">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <span className="text-sm font-medium text-slate-300">
                  Trusted by 500+ Logistics Teams
                </span>
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            © 2026 PortKey Logistics Solutions.
          </div>
        </div>
      </div>

      {/* Right Pane - Auth Form Wrapper */}
      <div className="flex w-full items-center justify-center bg-[#131B2E] p-8 lg:w-1/2">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
