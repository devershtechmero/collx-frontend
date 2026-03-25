import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Marketplace", href: "#marketplace" },
  { label: "Collection", href: "#collection" },
  { label: "Download App", href: "#download" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-current/15">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="space-y-2">
          <p className="text-xl font-semibold tracking-[-0.04em]">Coll X</p>
          <p className="text-sm text-foreground/68">
            Scan smarter, collect better, and stay close to the marketplace.
          </p>
        </div>

        <nav className="flex flex-wrap gap-4 text-sm text-foreground/74">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
