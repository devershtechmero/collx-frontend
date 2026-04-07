"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { ScanCardSection } from "@/components/pages/collection/scan-card-section";
import { SiteHeader } from "@/components/shared/layout/site-header";
import { SiteFooter } from "@/components/sections/home/site-footer";
import {
  COLLECTION_STORAGE_EVENT,
  isCardLiked,
  toggleLikedCard,
} from "@/lib/store/collection-store";
import { ALL_CARDS, CATEGORIES, type Card } from "@/lib/mock/cards";

const ITEMS_PER_PAGE = 12;

function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 border-t border-current/10 pt-8">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-full border border-current/15 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onChange(page)}
          className={`h-10 min-w-10 rounded-full border px-3 text-sm font-semibold transition-colors ${page === currentPage
            ? "border-foreground bg-foreground text-background"
            : "border-current/15 text-foreground hover:bg-foreground hover:text-background"
            }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-full border border-current/15 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

function CollectionCard({ card }: { card: Card }) {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const syncLikedState = () => setIsLiked(isCardLiked(card.id));

    syncLikedState();
    window.addEventListener(COLLECTION_STORAGE_EVENT, syncLikedState);

    return () => window.removeEventListener(COLLECTION_STORAGE_EVENT, syncLikedState);
  }, [card.id]);

  return (
    <article className="group overflow-hidden rounded-4xl border border-current/12 bg-foreground/3 transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/collection/${card.id}`} className="block">
        <div className="relative aspect-4/5 overflow-hidden border-b border-current/10">
          <Image
            src={card.image}
            alt={card.name}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {card.category}
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsLiked(toggleLikedCard(card));
            }}
            className={`absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-colors ${
              isLiked
                ? "border-red-500 bg-red-500 text-white"
                : "border-white/20 bg-black/35 text-white hover:bg-red-500 hover:border-red-500"
            }`}
            aria-pressed={isLiked}
            aria-label={isLiked ? `Unlike ${card.name}` : `Like ${card.name}`}
          >
            <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>
      </Link>

      <div className="space-y-2 p-5">
        <div className="space-y-2">
          <Link href={`/collection/${card.id}`} className="block">
            <h3 className="truncate text-lg font-semibold tracking-[-0.03em]">
              {card.name}
            </h3>
          </Link>
          <p className="truncate text-sm text-foreground/65">
            {card.description}
          </p>
        </div>
      </div>
    </article>
  );
}

export function CollectionBrowserPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  function handlePageChange(page: number) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
    setCurrentPage(1);
  }

  function handleCategoryChange(category: string) {
    setActiveCategory(category);
    setCurrentPage(1);
  }

  const query = search.trim().toLowerCase();

  const filteredCards = ALL_CARDS.filter((card) => {
    const matchesCategory =
      activeCategory === "All" || card.category === activeCategory;
    const matchesSearch =
      query.length === 0 ||
      card.name.toLowerCase().includes(query) ||
      card.player?.toLowerCase().includes(query) ||
      card.set?.toLowerCase().includes(query) ||
      card.description?.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / ITEMS_PER_PAGE));

  const resolvedCurrentPage = Math.min(currentPage, totalPages);

  const paginatedCards = filteredCards.slice(
    (resolvedCurrentPage - 1) * ITEMS_PER_PAGE,
    resolvedCurrentPage * ITEMS_PER_PAGE,
  );

  const scanCandidates = filteredCards.length > 0 ? filteredCards : ALL_CARDS;

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/45" />
            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search cards, players, sets..."
              className="w-full rounded-full border border-current/15 bg-background py-4 pl-12 pr-4 text-sm outline-none transition-colors focus:border-current/35"
            />
          </label>

          <ScanCardSection scanCandidates={scanCandidates} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-4xl border border-current/12 bg-foreground/3 p-5">
              <div className="border-b border-current/10 pb-4">
                {/* <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/60">
                  Filter
                </p> */}
                <h2 className="mt-2 text-lg font-semibold">Category</h2>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {["All", ...CATEGORIES].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors ${activeCategory === category
                      ? "bg-foreground text-background"
                      : "border border-current/10 bg-background/70 text-foreground hover:bg-foreground hover:text-background"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-foreground/62">
                Showing {paginatedCards.length} of {filteredCards.length} cards
              </p>
              <p className="text-sm text-foreground/62">
                Page {resolvedCurrentPage} of {totalPages}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {paginatedCards.map((card) => (
                <CollectionCard key={card.id} card={card} />
              ))}
            </div>

            {paginatedCards.length === 0 ? (
              <div className="rounded-4xl border border-dashed border-current/15 px-6 py-16 text-center">
                <h3 className="text-xl font-semibold">No cards found</h3>
                <p className="mt-2 text-sm text-foreground/62">
                  Try a different category or a broader search term.
                </p>
              </div>
            ) : null}

            <Pagination
              currentPage={resolvedCurrentPage}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
