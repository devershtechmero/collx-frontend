export interface CardPrice {
  grade: string;
  price: string;
}

export interface Card {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  dateAdded?: string;
  rank?: number;
  category: string;
  category_group?: string;
  player?: string;
  set?: string;
  set_type?: string;
  number?: string;
  variant?: string;
  rookie?: boolean;
  gain?: number;
  receivedGain?: number;
  card_id?: string;
  prices?: CardPrice[];
  "30 Day Sales"?: number;
  "7 Day Sales"?: number;
  rarity?: string;
  change?: string;
}

const FALLBACK_IMAGE = "https://picsum.photos/seed/collx-fallback/600/800";

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;

const asString = (value: unknown) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
};

const asNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/[$,%\s,]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const asBoolean = (value: unknown) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }

  return undefined;
};

const normalizeGain = (value: unknown, change?: string) => {
  const direct = asNumber(value);

  if (typeof direct === "number") {
    if (Math.abs(direct) > 1) {
      return direct / 100;
    }

    return direct;
  }

  if (!change) {
    return undefined;
  }

  const parsedChange = asNumber(change);
  return typeof parsedChange === "number" ? parsedChange / 100 : undefined;
};

const pickFirstValue = (values: unknown[]) => values.find((value) => value != null);

const normalizePrices = (value: unknown): CardPrice[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const prices = value
    .map((entry) => {
      const record = asRecord(entry);

      if (!record) {
        return null;
      }

      const grade = asString(record.grade) ?? asString(record.label) ?? "Unknown";
      const price = asString(record.price) ?? asString(record.amount) ?? "0";

      return { grade, price };
    })
    .filter((entry): entry is CardPrice => Boolean(entry));

  return prices.length > 0 ? prices : undefined;
};

export const getPrimaryPrice = (card: Card) => {
  if (typeof card.price === "number" && Number.isFinite(card.price)) {
    return card.price;
  }

  const fallback = card.prices?.find((entry) => entry.grade === "Raw") ?? card.prices?.[0];
  return fallback ? Number(fallback.price) || 0 : 0;
};

export const getTrendScore = (card: Card) => {
  const monthlySales = card["30 Day Sales"] ?? 0;
  const weeklySales = card["7 Day Sales"] ?? 0;
  const gainBoost = (card.gain ?? 0) * 1000;
  const price = getPrimaryPrice(card);

  return monthlySales * 3 + weeklySales * 2 + gainBoost + price;
};

export const normalizeCard = (value: unknown, index = 0): Card => {
  const record = asRecord(value) ?? {};
  const prices = normalizePrices(record.prices);
  const change = asString(record.change);
  const receivedGain = normalizeGain(
    pickFirstValue([
      record.received_gain,
      record.receivedGain,
      record.received_gain_percentage,
      record.receivedGainPercentage,
      record.received_gain_percent,
      record.receivedGainPercent,
    ]),
  );
  const player = asString(record.player);
  const set = asString(record.set);
  const number = asString(record.number);
  const name =
    asString(record.name) ??
    asString(record.title) ??
    [player, set, number ? `#${number}` : undefined].filter(Boolean).join(" ") ??
    "Untitled Card";
  const image =
    asString(record.image) ??
    asString(record.image_url) ??
    asString(record.front_image) ??
    asString(record.frontImage) ??
    asString(record.card_image) ??
    FALLBACK_IMAGE;
  const price =
    asNumber(record.price) ??
    (prices?.find((entry) => entry.grade === "Raw")
      ? Number(prices.find((entry) => entry.grade === "Raw")?.price)
      : undefined) ??
    (prices?.[0] ? Number(prices[0].price) : undefined) ??
    0;
  const category =
    asString(record.category) ??
    asString(record.sport) ??
    asString(record.category_name) ??
    "Uncategorized";
  const description =
    asString(record.description) ??
    [player, set, number ? `#${number}` : undefined].filter(Boolean).join(" ") ??
    name;

  return {
    id:
      asString(record.id) ??
      asString(record.card_id) ??
      asString(record.cardId) ??
      asString(record._id) ??
      `card-${index}`,
    card_id:
      asString(record.card_id) ??
      asString(record.cardId) ??
      asString(record.id) ??
      asString(record._id),
    name,
    price,
    image,
    description,
    dateAdded: asString(record.dateAdded) ?? asString(record.created_at),
    rank: asNumber(record.rank),
    category,
    category_group: asString(record.category_group),
    player,
    set,
    set_type: asString(record.set_type),
    number,
    variant: asString(record.variant),
    rookie: asBoolean(record.rookie),
    gain: normalizeGain(record.gain, change),
    receivedGain,
    prices,
    "30 Day Sales": asNumber(record["30 Day Sales"]) ?? asNumber(record.sales_30d),
    "7 Day Sales": asNumber(record["7 Day Sales"]) ?? asNumber(record.sales_7d),
    rarity: asString(record.rarity),
    change,
  };
};

export const extractCardList = (payload: unknown): Card[] => {
  if (Array.isArray(payload)) {
    return payload.map((entry, index) => normalizeCard(entry, index));
  }

  const record = asRecord(payload);

  if (!record) {
    return [];
  }

  const candidates = [
    record.cards,
    record.data,
    record.results,
    record.items,
    record.hits,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.map((entry, index) => normalizeCard(entry, index));
    }
  }

  return [];
};

export const extractSingleCard = (payload: unknown): Card | null => {
  if (Array.isArray(payload)) {
    return payload.length > 0 ? normalizeCard(payload[0], 0) : null;
  }

  const record = asRecord(payload);

  if (!record) {
    return null;
  }

  const nestedCard = record.card ?? record.data ?? record.result;

  if (nestedCard && !Array.isArray(nestedCard)) {
    return normalizeCard(nestedCard, 0);
  }

  return normalizeCard(record, 0);
};

export const extractPaginationMeta = (payload: unknown) => {
  const record =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : null;

  const pages =
    record && typeof record.pages === "number" && Number.isFinite(record.pages)
      ? record.pages
      : 1;
  const count =
    record && typeof record.count === "number" && Number.isFinite(record.count)
      ? record.count
      : 0;

  return {
    pages: Math.max(1, pages),
    count: Math.max(0, count),
  };
};

export const getCardCategories = (cards: Card[]) =>
  Array.from(
    new Set(cards.map((card) => card.category).filter((category) => category.trim().length > 0))
  ).sort((left, right) => left.localeCompare(right));

export const pickDeterministicRandomCard = (cards: Card[], seed: string) => {
  if (cards.length === 0) {
    return null;
  }

  const hash = seed.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return cards[hash % cards.length] ?? null;
};
