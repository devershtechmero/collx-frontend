"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { DOWNLOAD_APP_LINK, NAV_ITEMS } from "@/lib/constants/navigation";

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen((open) => !open);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-current/20 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-xl font-semibold tracking-[-0.04em] sm:text-2xl"
          >
            Coll X
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex lg:gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href={DOWNLOAD_APP_LINK}
              className="inline-flex rounded-full border border-current px-5 py-2.5 text-sm font-medium transition-all duration-200"
            >
              Download App
            </Link>

            <ThemeToggle />
          </div>

          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex items-center justify-center rounded-full border border-current p-2 md:hidden hover:cursor-pointer"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="mt-4 rounded-3xl border border-current/20 p-4 md:hidden">
            <nav className="flex flex-col gap-3 text-sm">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-2xl px-3 py-2 transition-colors duration-200"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              href={DOWNLOAD_APP_LINK}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-current px-5 py-3 text-sm font-medium transition-all duration-200"
              onClick={closeMobileMenu}
            >
              Download App
            </Link>

            <ThemeToggle mobile />
          </div>
        ) : null}
      </div>
    </header>
  );
}
