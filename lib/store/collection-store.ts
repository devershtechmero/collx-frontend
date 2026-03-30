import { type Card } from "@/lib/mock/cards";

const STORAGE_KEY = "collx_captured_cards";
const SAVED_STORAGE_KEY = "collx_saved_cards";
const LIKED_STORAGE_KEY = "collx_liked_cards";
const FOR_SALE_STORAGE_KEY = "collx_for_sale_cards";
export const COLLECTION_STORAGE_EVENT = "collx-storage-updated";

const readCards = (key: string): Card[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

const writeCards = (key: string, cards: Card[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(cards));
  window.dispatchEvent(new Event(COLLECTION_STORAGE_EVENT));
};

const readIds = (key: string): string[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

const writeIds = (key: string, ids: string[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(ids));
  window.dispatchEvent(new Event(COLLECTION_STORAGE_EVENT));
};

export const getCapturedCards = (): Card[] => {
  return readCards(STORAGE_KEY);
};

export const addCapturedCard = (card: Card) => {
  const current = getCapturedCards();
  writeCards(STORAGE_KEY, [card, ...current]);
};

export const clearCapturedCards = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(COLLECTION_STORAGE_EVENT));
};

const toggleCardInList = (key: string, card: Card) => {
  const current = readCards(key);
  const exists = current.some((item) => item.id === card.id);

  if (exists) {
    writeCards(
      key,
      current.filter((item) => item.id !== card.id)
    );
    return false;
  }

  writeCards(key, [card, ...current]);
  return true;
};

export const getSavedCards = (): Card[] => readCards(SAVED_STORAGE_KEY);

export const getLikedCards = (): Card[] => readCards(LIKED_STORAGE_KEY);

export const isCardSaved = (cardId: string) =>
  getSavedCards().some((card) => card.id === cardId);

export const isCardLiked = (cardId: string) =>
  getLikedCards().some((card) => card.id === cardId);

export const toggleSavedCard = (card: Card) => toggleCardInList(SAVED_STORAGE_KEY, card);

export const toggleLikedCard = (card: Card) => toggleCardInList(LIKED_STORAGE_KEY, card);

export const getCardsForSale = (): string[] => readIds(FOR_SALE_STORAGE_KEY);

export const isCardForSale = (cardId: string) => getCardsForSale().includes(cardId);

export const toggleCardForSale = (cardId: string) => {
  const current = getCardsForSale();
  const exists = current.includes(cardId);

  if (exists) {
    writeIds(
      FOR_SALE_STORAGE_KEY,
      current.filter((id) => id !== cardId)
    );
    return false;
  }

  writeIds(FOR_SALE_STORAGE_KEY, [cardId, ...current]);
  return true;
};
