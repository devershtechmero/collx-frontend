"use client";

import { Heart, Bookmark, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type Card } from "@/lib/mock/cards";
import {
  COLLECTION_STORAGE_EVENT,
  isCardForSale,
  isCardLiked,
  isCardSaved,
  toggleLikedCard,
  toggleSavedCard,
} from "@/lib/store/collection-store";

interface CardItemProps {
  card: Card;
  rank?: number;
  showDetails?: boolean;
  interactionMode?: "marketplace" | "collection";
  actionLabel?: string;
  onAction?: (card: Card) => void;
  showForSaleTag?: boolean;
}

export function CardItem({
  card,
  rank,
  showDetails = true,
  interactionMode = "marketplace",
  actionLabel = "See Details",
  onAction,
  showForSaleTag = false,
}: CardItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isListedForSale, setIsListedForSale] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const syncState = () => {
      setIsLiked(isCardLiked(card.id));
      setIsSaved(isCardSaved(card.id));
      setIsListedForSale(isCardForSale(card.id));
    };

    syncState();
    window.addEventListener(COLLECTION_STORAGE_EVENT, syncState);

    return () => window.removeEventListener(COLLECTION_STORAGE_EVENT, syncState);
  }, [card.id]);

  const showInteractions = interactionMode === "marketplace";
  const handlePrimaryAction = () => {
    if (onAction) {
      onAction(card);
      return;
    }

    router.push(`/dashboard/cards/${card.id}`);
  };

  return (
    <div
      className="group relative cursor-pointer"
      onClick={handlePrimaryAction}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handlePrimaryAction();
        }
      }}
    >
      <div className="relative aspect-3/4 rounded-2xl md:rounded-4xl overflow-hidden mb-3 md:mb-4 bg-foreground/5 border border-current/5">
        <Image 
          src={card.image} 
          alt={card.name}
          fill
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Interaction Buttons */}
        {showInteractions && (
          <div className="absolute top-2 md:top-4 right-2 md:right-4 flex flex-col gap-1.5 md:gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <button 
              onClick={(event) => {
                event.stopPropagation();
                setIsLiked(toggleLikedCard(card));
              }}
              className={`p-2 md:p-3 rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 ${
                isLiked ? "bg-pink-500 text-white" : "bg-background/80 text-foreground"
              }`}
            >
              <Heart size={16} className="md:w-4.5 md:h-4.5" fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={(event) => {
                event.stopPropagation();
                setIsSaved(toggleSavedCard(card));
              }}
              className={`p-2 md:p-3 rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 ${
                isSaved ? "bg-blue-500 text-white" : "bg-background/80 text-foreground"
              }`}
            >
              <Bookmark size={16} className="md:w-4.5 md:h-4.5" fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
        )}

        {showForSaleTag && isListedForSale && (
          <div className="absolute top-2 md:top-4 right-2 md:right-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wide text-white shadow-lg">
            <CheckCircle2 size={14} className="md:w-4 md:h-4" />
            <span>For Sale</span>
          </div>
        )}

        {rank && (
          <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-background/80 backdrop-blur-md px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold">
            #{rank}
          </div>
        )}

        {showDetails && (
          <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all hidden md:block">
            <button
              onClick={(event) => {
                event.stopPropagation();
                handlePrimaryAction();
              }}
              className="bg-background text-foreground px-4 py-2 rounded-full text-xs font-medium shadow-xl"
            >
              {actionLabel}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-0.5 md:space-y-1 px-1 md:px-2">
        <p className="text-[8px] md:text-[10px] font-bold text-foreground/30 uppercase tracking-wider">{card.category}</p>
        <h4 className="font-bold truncate text-xs md:text-base text-foreground group-hover:text-primary transition-colors">{card.name}</h4>
        <div className="flex items-center gap-1 font-bold text-sm md:text-lg">
          <span className="text-foreground/40 text-xs md:text-sm">$</span>
          <span>{card.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
