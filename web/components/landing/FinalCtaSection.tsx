import Link from "next/link";

export function FinalCtaSection() {
  return (
    <section className="border-t border-white/5 bg-[#0D1321] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Ready to eliminate demurrage fees?
        </h2>
        <p className="mt-4 text-lg text-[#9CA3AF]">
          Join the fastest-growing network of forwarders and importers in the
          Philippines. Setup takes less than 5 minutes.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/auth/sign-up"
            className="rounded-full border border-[#3B6CF6] px-6 py-3 text-sm font-semibold text-[#3B6CF6] transition-all hover:bg-[#3B6CF6] hover:text-white"
          >
            Get Started for Free
          </Link>
          <a
            href="#"
            className="rounded-full bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Schedule a Demo
          </a>
        </div>

        <p className="mt-5 text-xs text-[#9CA3AF]/60">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
