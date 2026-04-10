"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useRef } from "react";

import { SiteHeader } from "@/components/shared/layout/site-header";
import { SiteFooter } from "@/components/sections/home/site-footer";
import { getCollectionCardById, getCollectionData } from "@/lib/api/cards";
import {
  extractCardList,
  extractSingleCard,
  getPrimaryPrice,
  getTrendScore,
  type Card,
} from "@/lib/cards";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function RecommendationCard({ card }: { card: Card }) {
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
            unoptimized
          />
          <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {card.category}
          </div>
        </div>
      </Link>

      <div className="space-y-2 p-5">
        <Link href={`/collection/${card.id}`} className="block">
          <h3 className="truncate text-lg font-semibold tracking-[-0.03em]">
            {card.name}
          </h3>
        </Link>
        <p className="truncate text-sm text-foreground/65">{card.description}</p>
      </div>
    </article>
  );
}

function RecommendationSection({
  title,
  description,
  cards,
}: {
  title: string;
  description: string;
  cards: Card[];
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  if (cards.length === 0) return null;

  function scrollByAmount(direction: "left" | "right") {
    if (!scrollRef.current) {
      return;
    }

    const amount = Math.max(scrollRef.current.clientWidth * 0.85, 280);
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
            {title}
          </h2>
          <p className="text-sm text-foreground/64 sm:text-base">{description}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-current/15 text-foreground transition-colors hover:bg-foreground hover:text-background"
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-current/15 text-foreground transition-colors hover:bg-foreground hover:text-background"
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((entry) => (
          <div
            key={`${title}-${entry.id}`}
            className="min-w-75 max-w-75 sm:max-w-85"
          >
            <RecommendationCard card={entry} />
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[1.75rem] border border-current/12 bg-foreground/3 px-6 py-16 text-center">
      <h2 className="text-2xl font-semibold">Card unavailable</h2>
      <p className="mt-3 text-sm text-foreground/62">{message}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-80 items-center justify-center rounded-[1.75rem] border border-current/12 bg-foreground/3">
      <LoaderCircle className="h-10 w-10 animate-spin text-foreground/55" />
    </div>
  );
}

export default function CollectionDetailPage() {
  const params = useParams<{ id: string }>();
  const relatedCardsLimit = 80;

  const cardQuery = useQuery({
    queryKey: ["card-detail", params.id],
    queryFn: async () => {
      const payload = await getCollectionCardById(params.id);
      return extractSingleCard(payload);
    },
  });

  const catalogQuery = useQuery({
    queryKey: ["card-catalog", relatedCardsLimit, 1],
    queryFn: async () => {
      const payload = await getCollectionData(relatedCardsLimit, 1);
      return extractCardList(payload);
    },
  });

  const card = cardQuery.data ?? null;
  const catalogCards = useMemo(() => catalogQuery.data ?? [], [catalogQuery.data]);
  const error = cardQuery.error ?? catalogQuery.error;
  const isLoading = cardQuery.isPending || catalogQuery.isPending;

  const allCards = useMemo(() => {
    const merged = card ? [card, ...catalogCards] : [...catalogCards];
    const seen = new Set<string>();

    return merged.filter((entry) => {
      if (seen.has(entry.id)) {
        return false;
      }

      seen.add(entry.id);
      return true;
    });
  }, [card, catalogCards]);

  const trendingCards = useMemo(() => {
    if (!card) {
      return [];
    }

    return allCards
      .filter((entry) => entry.id !== card.id)
      .sort((left, right) => getTrendScore(right) - getTrendScore(left))
      .slice(0, 10);
  }, [allCards, card]);

  const sameCategoryCards = useMemo(() => {
    if (!card) {
      return [];
    }

    return allCards
      .filter((entry) => entry.id !== card.id && entry.category === card.category)
      .slice(0, 10);
  }, [allCards, card]);

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <SiteHeader />
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
          <LoadingState />
        </section>
        <SiteFooter />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen">
        <SiteHeader />
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
          <EmptyState
            message={error instanceof Error ? error.message : "Failed to load card."}
          />
        </section>
        <SiteFooter />
      </main>
    );
  }

  if (!card) {
    return (
      <main className="min-h-screen">
        <SiteHeader />
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
          <EmptyState message="We could not find this card in the backend response." />
        </section>
        <SiteFooter />
      </main>
    );
  }

  const detailStats = [
    { label: "Player", value: card.player ?? "Unknown" },
    { label: "Set", value: card.set ?? "Unknown" },
    { label: "Card Number", value: card.number ?? "N/A" },
    { label: "Variant", value: card.variant ?? card.rarity ?? "N/A" },
    { label: "30 Day Sales", value: card["30 Day Sales"]?.toLocaleString() ?? "0" },
    { label: "7 Day Sales", value: card["7 Day Sales"]?.toLocaleString() ?? "0" },
  ];

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
        <Link
          href="/collection"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/65 transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to collection
        </Link>

        <div className="mt-6 grid gap-6 rounded-[1.75rem] border border-current/12 bg-foreground/3 p-4 sm:gap-8 sm:rounded-[2.25rem] sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-current/10 bg-background/80 p-4 sm:rounded-4xl sm:p-6">
            <Image
              src={card.image}
              alt={card.name}
              fill
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-contain p-2 sm:p-3"
              loading="eager"
              priority
              unoptimized
            />
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-5">
              <div className="flex flex-col gap-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/58">
                    {card.category}
                    {card.category_group ? ` • ${card.category_group}` : ""}
                  </p>
                  <h1 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                    {card.player ?? card.name}
                  </h1>
                  <p className="text-base font-medium text-foreground/70 sm:text-lg">
                    {card.set}
                    {card.number ? ` • #${card.number}` : ""}
                  </p>
                </div>
              </div>

              <p className="max-w-2xl text-sm leading-7 text-foreground/72 sm:text-base">
                {card.description}
              </p>

              <div className="flex flex-wrap gap-3 text-sm text-foreground/66">
                {card.set_type ? (
                  <span className="rounded-full border border-current/10 bg-background/70 px-3 py-1.5">
                    Set Type: {card.set_type}
                  </span>
                ) : null}
                {typeof card.rookie === "boolean" ? (
                  <span className="rounded-full border border-current/10 bg-background/70 px-3 py-1.5">
                    Rookie: {card.rookie ? "Yes" : "No"}
                  </span>
                ) : null}
                {card.card_id ? (
                  <span className="rounded-full border border-current/10 bg-background/70 px-3 py-1.5">
                    Card ID: {card.card_id}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {detailStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-current/10 bg-background/70 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/52">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-current/10 bg-background/80 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/52">
                    Market Prices
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {formatCurrency(getPrimaryPrice(card))}
                  </p>
                </div>
                <p className="text-sm text-foreground/62">
                  Latest visible price by grade for this card.
                </p>
              </div>

              {card.prices?.length ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {card.prices.map((entry, index) => (
                    <div
                      key={`${entry.grade}-${entry.price}-${index}`}
                      className="rounded-3xl border border-current/10 bg-foreground/3 p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/52">
                        {entry.grade}
                      </p>
                      <p className="mt-2 text-lg font-semibold">
                        {formatCurrency(Number(entry.price))}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <RecommendationSection
          title="Trending cards"
          description="Ranked from the strongest selling cards using recent sales, visible price, and trend movement."
          cards={trendingCards}
        />

        <RecommendationSection
          title="Explore same category"
          description={`Keep browsing more ${card.category.toLowerCase()} cards from this backend dataset.`}
          cards={sameCategoryCards}
        />
      </section>

      <SiteFooter />
    </main>
  );
}
