import { type Card } from "@/lib/cards";

const STORAGE_KEY = "collx_user_collection";
const SAVED_STORAGE_KEY = "collx_saved_cards";
const LIKED_STORAGE_KEY = "collx_liked_cards";
const FOR_SALE_STORAGE_KEY = "collx_for_sale_cards";
export const COLLECTION_STORAGE_EVENT = "collx-storage-updated";

const normalizeCard = (card: Card): Card => ({
  ...card,
  dateAdded: card.dateAdded ?? new Date().toISOString(),
});

const readCards = (key: string): Card[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored).map((card: Card) => normalizeCard(card)) : [];
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

const ensureUserCollection = () => {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

export const getCapturedCards = (): Card[] => {
  ensureUserCollection();
  return readCards(STORAGE_KEY);
};

export const addCapturedCard = (card: Card) => {
  const current = getCapturedCards();
  writeCards(STORAGE_KEY, [normalizeCard(card), ...current]);
};

export const clearCapturedCards = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(COLLECTION_STORAGE_EVENT));
};

export const clearAllCollectionData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SAVED_STORAGE_KEY);
  localStorage.removeItem(LIKED_STORAGE_KEY);
  localStorage.removeItem(FOR_SALE_STORAGE_KEY);
  window.dispatchEvent(new Event(COLLECTION_STORAGE_EVENT));
};

export const updateCollectionCard = (cardId: string, updates: Partial<Card>) => {
  const current = getCapturedCards();
  writeCards(
    STORAGE_KEY,
    current.map((card) =>
      card.id === cardId ? normalizeCard({ ...card, ...updates, id: card.id }) : card
    )
  );
};

export const deleteCollectionCard = (cardId: string) => {
  const current = getCapturedCards();
  writeCards(
    STORAGE_KEY,
    current.filter((card) => card.id !== cardId)
  );

  writeIds(
    FOR_SALE_STORAGE_KEY,
    getCardsForSale().filter((id) => id !== cardId)
  );

  writeCards(
    SAVED_STORAGE_KEY,
    getSavedCards().filter((card) => card.id !== cardId)
  );

  writeCards(
    LIKED_STORAGE_KEY,
    getLikedCards().filter((card) => card.id !== cardId)
  );
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

export const getForSaleCards = (): Card[] => {
  const ids = new Set(getCardsForSale());
  return getCapturedCards().filter((card) => ids.has(card.id));
};

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
