const MARKETPLACE_CARDS = [
  {
    eyebrow: "Live listings",
    title: "See what is moving right now.",
    description:
      "Browse cleaner card listings, compare pricing momentum, and react faster to marketplace shifts.",
  },
  {
    eyebrow: "Smarter selling",
    title: "Turn your collection into active inventory.",
    description:
      "Use your scanned collection as the starting point for faster listing, pricing, and negotiations.",
  },
];

export function MarketplaceSection() {
  return (
    <section
      id="marketplace"
      className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-12"
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-foreground/60">
            Marketplace
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
            A marketplace experience designed around collectible momentum.
          </h2>
          <p className="text-sm leading-7 text-foreground/72 sm:text-base">
            Move from discovery to decision with a sharper view of listings,
            pricing, and what buyers are paying attention to.
          </p>
        </div>

        <div className="grid gap-4">
          {MARKETPLACE_CARDS.map((card) => (
            <article
              key={card.title}
              className="rounded-[2rem] border border-current/15 bg-foreground/[0.03] p-6 sm:p-7"
            >
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/58">
                {card.eyebrow}
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                {card.title}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-foreground/72">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
