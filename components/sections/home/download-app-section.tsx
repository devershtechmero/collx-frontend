import Link from "next/link";
import { Apple, ChevronRight, Play, ScanLine } from "lucide-react";

const STORE_LINKS = [
  {
    href: "/",
    eyebrow: "Download on",
    store: "Google Play",
    icon: Play,
  },
  {
    href: "/",
    eyebrow: "Available in",
    store: "App Store",
    icon: Apple,
  },
] as const;

export function DownloadAppSection() {
  return (
    <section
      id="download"
      className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-12"
    >
      <div className="relative overflow-hidden rounded-[2.4rem] border border-current/15 bg-background px-6 py-8 text-foreground sm:px-8 sm:py-10 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(127,127,127,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(127,127,127,0.08),transparent_34%)]" />

        <div className="relative grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
          <div className="max-w-2xl space-y-5">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-foreground/70">
              Download App
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:text-5xl">
              Your collection should stay close, even when you are away from
              your desk.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-foreground/78 sm:text-base">
              Scan cards, watch the market, and manage your collection with a
              mobile app built for speed and quick decisions.
            </p>

            <div className="grid gap-3 pt-2 sm:max-w-xl sm:grid-cols-2">
              {STORE_LINKS.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.store}
                    href={link.href}
                    className="group inline-flex items-center justify-between rounded-[1.6rem] border border-current bg-foreground px-4 py-4 text-background transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-background text-foreground">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-background/85">
                          {link.eyebrow}
                        </span>
                        <span className="text-sm font-semibold text-background">
                          {link.store}
                        </span>
                      </span>
                    </span>

                    <ChevronRight className="h-4 w-4 text-background/70 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[320px]">
            <div className="rounded-[2.6rem] border border-current/15 bg-foreground/4 p-3 backdrop-blur-sm">
              <div className="rounded-4xl bg-background p-4 text-foreground shadow-[0_20px_60px_-30px_rgba(0,0,0,0.45)]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/55">
                      Coll X Mobile
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-[-0.03em]">
                      Card Scanner
                    </p>
                  </div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background">
                    <ScanLine className="h-5 w-5" />
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="rounded-3xl border border-current/10 bg-foreground/3 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/55">
                      Today
                    </p>
                    <p className="mt-2 text-sm leading-6 text-foreground/74">
                      12 new cards scanned and 4 listings matched to your saved
                      watchlist.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[1.3rem] border border-current/10 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/55">
                        Scanned
                      </p>
                      <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                        248
                      </p>
                    </div>
                    <div className="rounded-[1.3rem] border border-current/10 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/55">
                        Alerts
                      </p>
                      <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                        19
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-current/10 p-4">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="font-medium">Collection sync</span>
                      <span className="text-foreground/55">Live</span>
                    </div>
                    <div className="h-2 rounded-full bg-foreground/10">
                      <div className="h-full w-[78%] rounded-full bg-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
