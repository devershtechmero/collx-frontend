import { type Card } from "@/lib/mock/cards";

const STORAGE_KEY = "collx_captured_cards";

export const getCapturedCards = (): Card[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addCapturedCard = (card: Card) => {
  if (typeof window === "undefined") return;
  const current = getCapturedCards();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([card, ...current]));
};

export const clearCapturedCards = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
};
