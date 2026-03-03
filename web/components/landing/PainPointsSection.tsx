import { PAIN_POINTS } from "./constants";

export function PainPointsSection() {
  return (
    <section className="border-t border-white/5 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            The High Cost of Manual Processing
          </h2>
          <p className="mt-4 text-lg text-[#9CA3AF]">
            Logistics teams in the Philippines lose millions annually due to
            lack of visibility. Stop flying blind.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PAIN_POINTS.map(
            ({ icon: Icon, iconColor, iconBg, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/5 bg-[#111827] p-7 transition-colors hover:border-white/10"
              >
                <div
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
                >
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#9CA3AF]">
                  {description}
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
