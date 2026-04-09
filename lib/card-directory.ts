"use client";

import { type Card } from "@/lib/cards";
import { getCapturedCards, getForSaleCards } from "@/lib/store/collection-store";

export interface CardOwner {
  name: string;
  isCurrentUser: boolean;
}

const MARKETPLACE_OWNERS = [
  "AvaColections",
  "CardVaultMax",
  "MintedMike",
  "TradeQueen",
  "RarePullsHub",
];

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("collx_user");
  return stored ? JSON.parse(stored) as { email: string; name: string } : null;
};

export const getCardOwner = (cardId: string): CardOwner => {
  const currentUser = getStoredUser();
  const ownCardIds = new Set(getCapturedCards().map((card) => card.id));

  if (ownCardIds.has(cardId)) {
    return {
      name: currentUser?.name || "Root Admin",
      isCurrentUser: true,
    };
  }

  const ownerIndex = Math.abs(
    cardId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % MARKETPLACE_OWNERS.length;

  return {
    name: MARKETPLACE_OWNERS[ownerIndex],
    isCurrentUser: false,
  };
};

export const getCardMarketplaceFeed = (): Card[] => {
  const listedCards = getForSaleCards();
  return [...listedCards];
};

export const getCardCatalog = (): Card[] => {
  const catalog = [...getCapturedCards(), ...getCardMarketplaceFeed()];
  const seen = new Set<string>();

  return catalog.filter((card) => {
    if (seen.has(card.id)) return false;
    seen.add(card.id);
    return true;
  });
};

export const getCardById = (cardId: string): Card | null =>
  getCardCatalog().find((card) => card.id === cardId) ?? null;
