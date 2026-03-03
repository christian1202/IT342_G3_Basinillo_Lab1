import Link from "next/link";
import { PRICING_PLANS } from "./constants";
import { CheckItem } from "./CheckItem";

export function PricingSection() {
  return (
    <section id="pricing" className="border-t border-white/5 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-[#9CA3AF]">
            Choose the plan that fits your shipment volume.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Single Pricing Card                                                 */
/* ------------------------------------------------------------------ */

function PricingCard({
  name,
  audience,
  price,
  period,
  badge,
  features,
  cta,
  highlighted,
}: (typeof PRICING_PLANS)[number]) {
  const cardStyles = highlighted
    ? "border-[#3B6CF6]/50 bg-[#131B2E] shadow-lg shadow-blue-500/10"
    : "border-white/5 bg-[#111827] hover:border-white/10";

  const buttonStyles = highlighted
    ? "bg-[#3B6CF6] text-white shadow-lg shadow-blue-500/25 hover:bg-[#2b5ad4]"
    : "border border-white/10 text-white hover:bg-white/5";

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-7 transition-colors ${cardStyles}`}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#3B6CF6] px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          {badge}
        </span>
      )}

      <p className="text-sm text-[#9CA3AF]">{audience}</p>

      <p className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-white">{price}</span>
        {period && <span className="text-sm text-[#9CA3AF]">{period}</span>}
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feat) => (
          <CheckItem key={feat} text={feat} />
        ))}
      </ul>

      <Link
        href={name === "Enterprise" ? "#" : "/auth/sign-up"}
        className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold transition-all ${buttonStyles}`}
      >
        {cta}
      </Link>
    </div>
  );
}
