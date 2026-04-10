"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { LoaderCircle, Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

import { ScanCardSection } from "@/components/pages/collection/scan-card-section";
import { SiteHeader } from "@/components/shared/layout/site-header";
import { SiteFooter } from "@/components/sections/home/site-footer";
import { getCollectionData, searchCollectionCards } from "@/lib/api/cards";
import {
  extractCardList,
  extractPaginationMeta,
  getCardCategories,
  type Card,
} from "@/lib/cards";

const ITEMS_PER_PAGE = 48;
const CATEGORY_SOURCE_LIMIT = 1000;

function getGainBadge(gain?: number) {
  if (typeof gain !== "number" || Object.is(gain, -0)) {
    return {
      label: "0.00%",
      className: "border-white/15 bg-black/70 text-slate-200",
    };
  }

  if (gain > 0) {
    return {
      label: `+${(gain * 100).toFixed(2)}%`,
      className: "border-emerald-400/30 bg-black/70 text-emerald-300",
    };
  }

  if (gain < 0) {
    return {
      label: `${(gain * 100).toFixed(2)}%`,
      className: "border-rose-400/30 bg-black/70 text-rose-300",
    };
  }

  return {
    label: "0.00%",
    className: "border-white/15 bg-black/70 text-slate-200",
  };
}
 
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

  const groupStart = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const groupEnd = Math.min(totalPages, groupStart + 9);
  const pages = Array.from(
    { length: groupEnd - groupStart + 1 },
    (_, index) => groupStart + index,
  );

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
  const gainBadge = getGainBadge(card.receivedGain ?? card.gain);

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
          <div
            className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md ${gainBadge.className}`}
          >
            {gainBadge.label}
          </div>
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

function LoadingGrid() {
  return (
    <div className="flex min-h-90 items-center justify-center rounded-4xl border border-current/12 bg-foreground/3">
      <LoaderCircle className="h-10 w-10 animate-spin text-foreground/55" />
    </div>
  );
}

export function CollectionBrowserPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const deferredSearch = useDeferredValue(search);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
    setCurrentPage(1);
  }

  function handleCategoryChange(category: string) {
    setActiveCategory(category);
    setCurrentPage(1);
  }

  const trimmedSearch = deferredSearch.trim();
  const isCategoryFiltered = activeCategory !== "All";

  const {
    data,
    error,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ["collection-cards", trimmedSearch, activeCategory, currentPage],
    queryFn: async () => {
      if (isCategoryFiltered) {
        const payload = await searchCollectionCards(activeCategory, CATEGORY_SOURCE_LIMIT, 1);
        const categoryCards = extractCardList(payload).filter(
          (card) => card.category === activeCategory,
        );
        const filteredBySearch =
          trimmedSearch.length === 0
            ? categoryCards
            : categoryCards.filter((card) => {
                const query = trimmedSearch.toLowerCase();

                return (
                  card.name.toLowerCase().includes(query) ||
                  card.player?.toLowerCase().includes(query) ||
                  card.set?.toLowerCase().includes(query) ||
                  card.description?.toLowerCase().includes(query)
                );
              });
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginatedCards = filteredBySearch.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        return {
          cards: paginatedCards,
          meta: {
            pages: Math.max(1, Math.ceil(filteredBySearch.length / ITEMS_PER_PAGE)),
            count: filteredBySearch.length,
          },
        };
      }

      const payload = trimmedSearch
        ? await searchCollectionCards(trimmedSearch, ITEMS_PER_PAGE, currentPage)
        : await getCollectionData(ITEMS_PER_PAGE, currentPage);

      return {
        cards: extractCardList(payload),
        meta: extractPaginationMeta(payload),
      };
    },
    placeholderData: keepPreviousData,
  });

  const categoryCatalogQuery = useQuery({
    queryKey: ["collection-categories", CATEGORY_SOURCE_LIMIT],
    queryFn: async () => {
      const payload = await getCollectionData(CATEGORY_SOURCE_LIMIT, 1);
      return extractCardList(payload);
    },
    staleTime: 5 * 60 * 1000,
  });

  const cards = useMemo(() => data?.cards ?? [], [data]);
  const categorySourceCards = useMemo(
    () => categoryCatalogQuery.data ?? [],
    [categoryCatalogQuery.data],
  );
  const totalPages = data?.meta.pages ?? 1;
  const totalCount = data?.meta.count ?? 0;
  const query = trimmedSearch.toLowerCase();

  const categories = useMemo(
    () => getCardCategories(categorySourceCards.length > 0 ? categorySourceCards : cards),
    [categorySourceCards, cards],
  );

  const filteredCards = isCategoryFiltered
    ? cards
    : cards.filter((card) => {
        const matchesSearch =
          query.length === 0 ||
          card.name.toLowerCase().includes(query) ||
          card.player?.toLowerCase().includes(query) ||
          card.set?.toLowerCase().includes(query) ||
          card.description?.toLowerCase().includes(query);

        return matchesSearch;
      });
  const resolvedCurrentPage = Math.min(currentPage, totalPages);

  function handlePageChange(page: number) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }

  const scanCandidates = filteredCards.length > 0 ? filteredCards : cards;

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
                {["All", ...categories].map((category) => (
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
                Showing {filteredCards.length} of {totalCount.toLocaleString()} cards
              </p>
              <p className="text-sm text-foreground/62">
                Page {resolvedCurrentPage} of {totalPages}
              </p>
            </div>

            {isPending || isFetching ? (
              <LoadingGrid />
            ) : null}

            {error ? (
              <div className="rounded-4xl border border-rose-500/20 bg-rose-500/6 px-6 py-5 text-sm text-rose-700">
                {error instanceof Error ? error.message : "Failed to load cards."}
              </div>
            ) : null}

            {!isPending ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {filteredCards.map((card) => (
                  <CollectionCard key={card.id} card={card} />
                ))}
              </div>
            ) : null}

            {!isPending && filteredCards.length === 0 ? (
              <div className="rounded-4xl border border-dashed border-current/15 px-6 py-16 text-center">
                <h3 className="text-xl font-semibold">No cards found</h3>
                <p className="mt-2 text-sm text-foreground/62">
                  Try a different category or a broader search term.
                </p>
              </div>
            ) : null}

            {!isPending ? (
              <Pagination
                currentPage={resolvedCurrentPage}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            ) : null}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
