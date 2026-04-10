export interface PriceHistoryPoint {
  date: string;
  price: number;
  timestamp: number;
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;

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

const toTimestamp = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 10_000_000_000 ? value : value * 1000;
  }

  if (typeof value === "string") {
    const numeric = Number(value);

    if (Number.isFinite(numeric) && value.trim() !== "") {
      return numeric > 10_000_000_000 ? numeric : numeric * 1000;
    }

    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const normalizeHistoryPoint = (dateValue: unknown, priceValue: unknown) => {
  const price = asNumber(priceValue);
  const timestamp = toTimestamp(dateValue);

  if (typeof price !== "number" || typeof timestamp !== "number") {
    return null;
  }

  return {
    date: new Date(timestamp).toISOString(),
    price,
    timestamp,
  } satisfies PriceHistoryPoint;
};

const normalizeHistoryEntry = (entry: unknown) => {
  if (Array.isArray(entry) && entry.length >= 2) {
    return normalizeHistoryPoint(entry[0], entry[1]);
  }

  const record = asRecord(entry);

  if (!record) {
    return null;
  }

  const dateValue =
    record.date ??
    record.datetime ??
    record.closing_date ??
    record.closingDate ??
    record.timestamp ??
    record.created_at ??
    record.createdAt ??
    record.recorded_at ??
    record.recordedAt ??
    record.day ??
    record.label ??
    record.x;
  const priceValue =
    record.price ??
    record.value ??
    record.amount ??
    record.market_price ??
    record.marketPrice ??
    record.avg_price ??
    record.average_price ??
    record.close ??
    record.closing_price ??
    record.closingPrice ??
    record.sale_price ??
    record.y;

  return normalizeHistoryPoint(dateValue, priceValue);
};

const extractObjectSeries = (record: Record<string, unknown>) => {
  const entries = Object.entries(record)
    .map(([key, value]) => normalizeHistoryPoint(key, value))
    .filter((entry): entry is PriceHistoryPoint => Boolean(entry));

  return entries;
};

const zipHistorySeries = (dates: unknown[], prices: unknown[]) =>
  dates
    .map((dateValue, index) => normalizeHistoryPoint(dateValue, prices[index]))
    .filter((entry): entry is PriceHistoryPoint => Boolean(entry));

const extractSeriesFromRecord = (value: unknown): PriceHistoryPoint[] => {
  const record = asRecord(value);

  if (!record) {
    return [];
  }

  const labels = Array.isArray(record.labels)
    ? record.labels
    : Array.isArray(record.dates)
      ? record.dates
      : Array.isArray(record.x)
        ? record.x
        : null;
  const values = Array.isArray(record.data)
    ? record.data
    : Array.isArray(record.prices)
      ? record.prices
      : Array.isArray(record.values)
        ? record.values
        : Array.isArray(record.y)
          ? record.y
          : null;

  if (labels && values && labels.length > 0 && values.length > 0) {
    return zipHistorySeries(labels, values);
  }

  if (Array.isArray(record.datasets)) {
    const dataset = record.datasets
      .map((entry) => asRecord(entry))
      .find((entry) => entry && Array.isArray(entry.data));

    if (dataset && labels) {
      return zipHistorySeries(labels, dataset.data as unknown[]);
    }
  }

  const objectSeries = extractObjectSeries(record);

  if (objectSeries.length > 0) {
    return objectSeries;
  }

  return [];
};

const searchHistoryArrays = (value: unknown): PriceHistoryPoint[] => {
  if (Array.isArray(value)) {
    const normalized = value
      .map((entry) => normalizeHistoryEntry(entry))
      .filter((entry): entry is PriceHistoryPoint => Boolean(entry));

    if (normalized.length > 0) {
      return normalized;
    }

    for (const entry of value) {
      const nested = searchHistoryArrays(entry);
      if (nested.length > 0) {
        return nested;
      }
    }

    return [];
  }

  const directSeries = extractSeriesFromRecord(value);

  if (directSeries.length > 0) {
    return directSeries;
  }

  const record = asRecord(value);

  if (!record) {
    return [];
  }

  const candidates = [
    record.data,
    record.result,
    record.results,
    record.history,
    record.price_history,
    record.priceHistory,
    record.points,
    record.series,
    record.chart,
  ];

  for (const candidate of candidates) {
    const nested = searchHistoryArrays(candidate);
    if (nested.length > 0) {
      return nested;
    }
  }

  for (const candidate of Object.values(record)) {
    const nested = searchHistoryArrays(candidate);
    if (nested.length > 0) {
      return nested;
    }
  }

  return [];
};

export const extractPriceHistory = (payload: unknown) =>
  searchHistoryArrays(payload)
    .sort((left, right) => left.timestamp - right.timestamp)
    .filter((entry, index, collection) => {
      const previous = collection[index - 1];
      return !previous || previous.timestamp !== entry.timestamp || previous.price !== entry.price;
    });

export function formatPriceHistoryDate(value: string) {
  const parsed = Date.parse(value);

  if (!Number.isFinite(parsed)) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(parsed));
}

export function formatPriceAxisValue(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
}
