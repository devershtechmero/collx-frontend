import { Camera, ShieldCheck, Sparkles, Zap } from "lucide-react";

const FEATURES = [
  {
    title: "Instant card scanning",
    description:
      "Capture a card in seconds and move from camera to structured data without a clunky manual workflow.",
    icon: Camera,
  },
  {
    title: "Trusted pricing signals",
    description:
      "Track value shifts with clearer market context so collectors can make faster buying and selling decisions.",
    icon: Zap,
  },
  {
    title: "Cleaner collection control",
    description:
      "Organize inventory, surface highlights, and keep your collection ready for showcase, trade, or sale.",
    icon: Sparkles,
  },
  {
    title: "Secure account flows",
    description:
      "Theme-aware authentication, simulated OTP verification, and smoother recovery steps keep onboarding tidy.",
    icon: ShieldCheck,
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-12"
    >
      <div className="mb-8 max-w-2xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-foreground/60">
          Features
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
          Built for collectors who want speed, clarity, and control.
        </h2>
        <p className="text-sm leading-7 text-foreground/72 sm:text-base">
          Coll X helps users scan cards, understand value, and manage their
          collection in one polished workflow.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="rounded-[2rem] border border-current/15 bg-background p-6"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-current/15 bg-foreground text-background">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em]">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-foreground/72">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
