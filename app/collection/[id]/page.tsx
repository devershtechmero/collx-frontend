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
      (entry.player === card.player || entry.set === card.set || entry.rarity === card.rarity),
  ).slice(0, 10);
  const sameCategoryCards = ALL_CARDS.filter(
    (entry) => entry.id !== card.id && entry.category === card.category,
  ).slice(0, 10);

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
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/58">
                {card.category}
              </p>
              <h1 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                {card.name}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-foreground/72 sm:text-base">
                {card.description} This detail view gives you a clean read on the
                card, its set, rarity, and quick interaction options for building
                out a much larger collection browser.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-current/10 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/52">
                  Player
                </p>
                <p className="mt-2 text-lg font-semibold">{card.player}</p>
              </div>
              <div className="rounded-3xl border border-current/10 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/52">
                  Set
                </p>
                <p className="mt-2 text-lg font-semibold">{card.set}</p>
              </div>
              <div className="rounded-3xl border border-current/10 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/52">
                  Rarity
                </p>
                <p className="mt-2 text-lg font-semibold">{card.rarity}</p>
              </div>
              <div className="rounded-3xl border border-current/10 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/52">
                  Price
                </p>
                <p className="mt-2 text-lg font-semibold">${card.price.toLocaleString()}</p>
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
          description="More cards connected by player, set, or rarity."
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
