const COLLECTION_POINTS = [
  "Track standout cards, recent adds, and collection depth in one place.",
  "Group inventory by player, set, year, brand, or personal categories.",
  "Keep cards ready for private showcase, public sharing, or selling.",
];

export function CollectionSection() {
  return (
    <section
      id="collection"
      className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-12"
    >
      <div className="rounded-[2.25rem] border border-current/15 bg-background p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-foreground/60">
              Collection
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
              Your collection should feel curated, not chaotic.
            </h2>
            <p className="text-sm leading-7 text-foreground/72 sm:text-base">
              Coll X helps collectors keep everything organized, visual, and
              ready for whatever comes next.
            </p>
          </div>

          <div className="rounded-[2rem] border border-current/15 bg-foreground/[0.03] p-6">
            <ul className="space-y-4">
              {COLLECTION_POINTS.map((point) => (
                <li
                  key={point}
                  className="rounded-[1.4rem] border border-current/10 px-4 py-4 text-sm leading-6 text-foreground/76"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
