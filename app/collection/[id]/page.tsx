"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ChevronLeft } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { SiteHeader } from "@/components/shared/layout/site-header";
import { SiteFooter } from "@/components/sections/home/site-footer";
import { ALL_CARDS } from "@/lib/mock/cards";
import {
  COLLECTION_STORAGE_EVENT,
  isCardLiked,
  toggleLikedCard,
} from "@/lib/store/collection-store";

export default function CollectionDetailPage() {
  const params = useParams<{ id: string }>();
  const card = useMemo(
    () => ALL_CARDS.find((entry) => entry.id === params.id),
    [params.id],
  );
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

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
        <Link
          href="/collection"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/65 transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to collection
        </Link>

        <div className="mt-6 grid gap-8 rounded-[2.25rem] border border-current/12 bg-foreground/[0.03] p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-current/10">
            <Image src={card.image} alt={card.name} fill className="object-cover" />
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
              <div className="rounded-[1.5rem] border border-current/10 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/52">
                  Player
                </p>
                <p className="mt-2 text-lg font-semibold">{card.player}</p>
              </div>
              <div className="rounded-[1.5rem] border border-current/10 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/52">
                  Set
                </p>
                <p className="mt-2 text-lg font-semibold">{card.set}</p>
              </div>
              <div className="rounded-[1.5rem] border border-current/10 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/52">
                  Rarity
                </p>
                <p className="mt-2 text-lg font-semibold">{card.rarity}</p>
              </div>
              <div className="rounded-[1.5rem] border border-current/10 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/52">
                  Price
                </p>
                <p className="mt-2 text-lg font-semibold">${card.price.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsLiked(toggleLikedCard(card))}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-colors ${
                  isLiked
                    ? "border-foreground bg-foreground text-background"
                    : "border-current/15"
                }`}
              >
                <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
                {isLiked ? "Liked" : "Like this card"}
              </button>

              <Link
                href="/collection"
                className="inline-flex items-center justify-center rounded-full border border-current/15 px-5 py-3 text-sm font-semibold transition-colors hover:bg-foreground hover:text-background"
              >
                Browse more cards
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
