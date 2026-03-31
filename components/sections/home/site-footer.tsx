import Link from "next/link";
import { COMPANY_LINKS, LEGAL_LINKS } from "@/lib/constants/navigation";

const FOOTER_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Marketplace", href: "/#marketplace" },
  { label: "Collection", href: "/#collection" },
  { label: "Download App", href: "/#download" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-current/15">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <p className="text-xl font-semibold tracking-[-0.04em]">Coll X</p>
            <p className="max-w-xs text-sm leading-relaxed text-foreground/68">
              Scan smarter, collect better, and stay close to the marketplace.
              The world&apos;s fastest sports card scanner.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                Product
              </p>
              <nav className="flex flex-col gap-2 text-sm text-foreground/74">
                {FOOTER_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                Company
              </p>
              <nav className="flex flex-col gap-2 text-sm text-foreground/74">
                {COMPANY_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                Legal
              </p>
              <nav className="flex flex-col gap-2 text-sm text-foreground/74">
                {LEGAL_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-current/10 pt-8 text-xs text-foreground/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Coll X. All rights reserved.</p>
          <div className="flex gap-6">
            <p className="flex items-center gap-2">
              Built for collectors by collectors
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
