"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Bookmark, ChevronLeft, ChevronRight, Heart, MessageSquare, ShoppingBag, TrendingUp } from "lucide-react";
import { CardItem } from "@/components/shared/cards/card-item";
import { TRENDING_CARDS, type Card } from "@/lib/mock/cards";
import { COLLECTION_STORAGE_EVENT, isCardLiked, isCardSaved, toggleSavedCard } from "@/lib/store/collection-store";
import { getCardById, getCardCatalog, getCardOwner } from "@/lib/card-directory";

const getAveragePrice = (card: Card) => {
  const variance = (card.id.length % 5) * 0.03 + 0.88;
  return Math.round(card.price * variance);
};

export default function CardDetailsPage() {
  const params = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const similarScrollRef = useRef<HTMLDivElement>(null);
  const trendingScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncCard = () => {
      const cardId = Array.isArray(params.id) ? params.id[0] : params.id;
      const nextCard = cardId ? getCardById(cardId) : null;
      setCard(nextCard);
      setIsSaved(nextCard ? isCardSaved(nextCard.id) : false);
      setIsLiked(nextCard ? isCardLiked(nextCard.id) : false);
    };

    syncCard();
    window.addEventListener(COLLECTION_STORAGE_EVENT, syncCard);
    return () => window.removeEventListener(COLLECTION_STORAGE_EVENT, syncCard);
  }, [params.id]);

  const owner = useMemo(() => (card ? getCardOwner(card.id) : null), [card]);
  const activityCounts = useMemo(() => {
    if (!card) return { saves: 0, likes: 0 };
    const seed = card.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      saves: 12 + (seed % 37) + (isSaved ? 1 : 0),
      likes: 24 + (seed % 53) + (isLiked ? 1 : 0),
    };
  }, [card, isLiked, isSaved]);

  const similarCards = useMemo(() => {
    if (!card) return [];
    return getCardCatalog()
      .filter((item) => item.category === card.category && item.id !== card.id)
      .slice(0, 8);
  }, [card]);

  const scrollCards = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (!ref.current) return;
    const { scrollLeft, clientWidth } = ref.current;
    const nextLeft = direction === "left" ? scrollLeft - clientWidth / 1.4 : scrollLeft + clientWidth / 1.4;
    ref.current.scrollTo({ left: nextLeft, behavior: "smooth" });
  };

  if (!card) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/browse" className="inline-flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Browse</span>
        </Link>
        <div className="rounded-[2.5rem] border border-current/10 bg-current/5 p-8 md:p-12 text-center text-foreground/40">
          Card not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-12">
      <Link href="/dashboard/browse" className="inline-flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-foreground transition-colors">
        <ArrowLeft size={16} />
        <span>Back to Browse</span>
      </Link>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-6 lg:gap-8 rounded-4xl md:rounded-[2.5rem] border border-current/10 bg-background p-4 md:p-6">
        <div className="relative aspect-3/4 overflow-hidden rounded-[1.75rem] md:rounded-4xl bg-current/5">
          <Image src={card.image} alt={card.name} fill className="object-cover" />
        </div>

        <div className="flex flex-col justify-between gap-6 md:gap-8 py-1">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-3xl font-bold tracking-tight">{card.name}</h1>
               <p className="text-[13px] font-bold inline px-1 py-1 text-foreground/35">{card.category}</p>
            </div>

            <div className="rounded-[1.75rem] border border-current/10 bg-current/5 p-5 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-foreground/35">Card Owned By</p>
                  <p className="mt-1 text-lg font-bold">{owner?.name ?? "Collector"}</p>
                </div>
                <Link
                  href="/dashboard/chat"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-current/10 px-5 py-3 text-sm font-bold hover:bg-background transition-all"
                >
                  <MessageSquare size={16} />
                  <span>{owner?.isCurrentUser ? "Open Your Chat" : `Chat with ${owner?.name}`}</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-3xl bg-background p-4 border border-current/10">
                  <p className="text-[13px] font-bold text-foreground/35">Average Price</p>
                  <p className="mt-2 text-2xl font-bold">${getAveragePrice(card).toLocaleString()}</p>
                </div>
                <div className="rounded-3xl bg-background p-4 border border-current/10">
                  <p className="text-[13px] font-bold text-foreground/35">Owner Asking Price</p>
                  <p className="mt-2 text-2xl font-bold">${card.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-background p-4 border border-current/10">
                  <div className="flex items-center gap-2 text-foreground/50">
                    <Bookmark size={16} />
                    <p className="text-[13px] font-bold">Saves</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold">{activityCounts.saves}</p>
                </div>
                <div className="rounded-3xl bg-background p-4 border border-current/10">
                  <div className="flex items-center gap-2 text-foreground/50">
                    <Heart size={16} />
                    <p className="text-[13px] font-bold">Likes</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold">{activityCounts.likes}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsSaved(toggleSavedCard(card))}
              className={`inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full px-6 py-4 text-sm md:text-base font-bold transition-all border ${
                isSaved
                  ? "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "border-current/10 bg-background text-foreground hover:bg-current/5"
              }`}
            >
              <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>
            {!owner?.isCurrentUser && (
              <button className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-foreground px-6 py-4 text-sm md:text-base font-bold text-background transition-all hover:scale-[1.01] active:scale-[0.98] shadow-xl shadow-foreground/10">
                <ShoppingBag size={18} />
                <span>Buy Now</span>
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Similar Category Cards</h2>
            <p className="text-sm text-foreground/50">More cards collectors are browsing in {card.category} right now.</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scrollCards(similarScrollRef, "left")}
              className="p-3 rounded-full border border-current/10 hover:bg-current/5 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollCards(similarScrollRef, "right")}
              className="p-3 rounded-full border border-current/10 hover:bg-current/5 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div ref={similarScrollRef} className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
          {similarCards.map((item) => (
            <div key={item.id} className="w-56 md:w-64 flex-none snap-start">
              <CardItem card={item} showForSaleTag interactionMode={owner?.isCurrentUser && item.id === card.id ? "collection" : "marketplace"} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-current/5 p-3">
              <TrendingUp size={18} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Trending Cards Today</h2>
              <p className="text-sm text-foreground/50">Daily highlights from the marketplace.</p>
            </div>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scrollCards(trendingScrollRef, "left")}
              className="p-3 rounded-full border border-current/10 hover:bg-current/5 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollCards(trendingScrollRef, "right")}
              className="p-3 rounded-full border border-current/10 hover:bg-current/5 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div ref={trendingScrollRef} className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
          {TRENDING_CARDS.map((item, index) => (
            <div key={item.id} className="w-56 md:w-64 flex-none snap-start">
              <CardItem card={item} rank={index + 1} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
