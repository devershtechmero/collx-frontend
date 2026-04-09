"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SiteHeader } from "@/components/shared/layout/site-header";
import { SiteFooter } from "@/components/sections/home/site-footer";
import { ALL_CARDS, TRENDING_CARDS, type Card } from "@/lib/mock/cards";
import {
  COLLECTION_STORAGE_EVENT,
  isCardLiked,
  toggleLikedCard,
} from "@/lib/store/collection-store";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function getPrimaryPrice(card: Card) {
  if (typeof card.price === "number" && !Number.isNaN(card.price)) {
    return card.price;
  }

  const fallback = card.prices?.find((entry) => entry.grade === "Raw") ?? card.prices?.[0];
  return fallback ? Number(fallback.price) : 0;
}

function getGainBadge(gain?: number) {
  if (typeof gain !== "number") {
    return {
      label: "No trend",
      className: "border-slate-400/20 bg-slate-500/10 text-slate-600",
    };
  }

  if (gain > 0) {
    return {
      label: `+${(gain * 100).toFixed(2)}%`,
      className: "border-emerald-500/20 bg-emerald-500/12 text-emerald-600",
    };
  }

  if (gain < 0) {
    return {
      label: `${(gain * 100).toFixed(2)}%`,
      className: "border-rose-500/20 bg-rose-500/12 text-rose-600",
    };
  }

  return {
    label: "0.00%",
    className: "border-slate-400/20 bg-slate-500/10 text-slate-600",
  };
}

function RecommendationCard({ card }: { card: Card }) {
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
                : "border-white/20 bg-black/35 text-white hover:border-red-500 hover:bg-red-500"
            }`}
            aria-pressed={isLiked}
            aria-label={isLiked ? `Unlike ${card.name}` : `Like ${card.name}`}
          >
            <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
          </button>
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
            className="min-w-65wmax-w-65in-w-[300px] sm:max-w-75"
          >
            <RecommendationCard card={entry} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CollectionDetailPage() {
  const params = useParams<{ id: string }>();
  const card = ALL_CARDS.find((entry) => entry.id === params.id);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!card) return;

    const syncLikedState = () => setIsLiked(isCardLiked(card.id));

    syncLikedState();
    window.addEventListener(COLLECTION_STORAGE_EVENT, syncLikedState);

    return () => window.removeEventListener(COLLECTION_STORAGE_EVENT, syncLikedState);
  }, [card]);

  if (!card) {
    notFound();
  }

  const trendingCards = TRENDING_CARDS.filter((entry) => entry.id !== card.id).slice(0, 10);
  const relatedCards = ALL_CARDS.filter(
    (entry) =>
      entry.id !== card.id &&
      (entry.player === card.player ||
        entry.set === card.set ||
        entry.variant === card.variant ||
        entry.rarity === card.rarity),
  ).slice(0, 10);
  const sameCategoryCards = ALL_CARDS.filter(
    (entry) => entry.id !== card.id && entry.category === card.category,
  ).slice(0, 10);
  const gainBadge = getGainBadge(card.gain);
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
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-current/10 sm:rounded-4xl">
            <Image
              src={card.image}
              alt={card.name}
              fill
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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

                <div
                  className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-semibold ${gainBadge.className}`}
                >
                  {gainBadge.label}
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

            <div className="rounded-[1.5rem] border border-current/10 bg-background/80 p-5">
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

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {card.prices?.map((entry) => (
                  <div
                    key={entry.grade}
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
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={() => setIsLiked(toggleLikedCard(card))}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-colors ${
                  isLiked
                    ? "border-foreground bg-foreground text-background"
                    : "border-current/15 text-foreground hover:bg-foreground hover:text-background"
                }`}
              >
                <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
                {isLiked ? "Liked" : "Like this card"}
              </button>

              {/* <Link
                href="/collection"
                className="inline-flex items-center justify-center rounded-full border border-current/15 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Browse more cards
              </Link> */}
            </div>
          </div>
        </div>

        <RecommendationSection
          title="Trending cards"
          description="Popular cards collectors are checking right now."
          cards={trendingCards}
        />

        <RecommendationSection
          title="Related cards"
          description="More cards connected by player, set, or variant."
          cards={relatedCards}
        />

        <RecommendationSection
          title="Explore same category"
          description={`Keep browsing more ${card.category.toLowerCase()} cards from the collection.`}
          cards={sameCategoryCards}
        />
      </section>

      <SiteFooter />
    </main>
  );
}
