import {
  Camera,
  ChartColumn,
  Handshake,
  MessagesSquare,
  WalletCards,
} from "lucide-react";

const STEPS = [
  {
    title: "Snap a photo of your trading card",
    description:
      "Scan any sports card or TCG card to instantly recognize it against our database of every known card.",
    icon: Camera,
  },
  {
    title: "Get the market value in seconds",
    description:
      "Get the average value of your card, based on all recent transactions from marketplaces.",
    icon: ChartColumn,
  },
  {
    title: "Build your collection and track the portfolio value",
    description:
      "Track your cards and total collection value over time. Filter, sort, and search your cards.",
    icon: WalletCards,
  },
  {
    title: "Stay connected with the community",
    description:
      "Connect with collectors. Message other users about their cards, make offers to buy, sell, or trade.",
    icon: MessagesSquare,
  },
  {
    title: "Buy and sell cards. Get top dollar by getting yours graded.",
    description:
      "Unload and acquire cards, and negotiate multi-card transactions with our Deals interface.",
    icon: Handshake,
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-12">
      <div className="mx-auto max-w-4xl space-y-8 text-center">
        <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-foreground/60">
              How CollX Works
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
              From quick scan to smarter collecting, everything flows in a few
              steps.
            </h2>
        </div>

        <div className="grid gap-4 text-left">
          {STEPS.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.title}
                className="rounded-[1.8rem] border border-current/15 bg-background p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-0.03em]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-foreground/72">
                      {step.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
