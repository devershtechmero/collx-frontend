const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3030/api";
const CACHE_PREFIX = "collx_api_cache:";
const memoryCache = new Map<string, { expiresAt: number; data: unknown }>();

type CacheEntry = {
  expiresAt: number;
  data: unknown;
};

type RequestOptions = RequestInit & {
  cacheKey?: string;
  ttlMs?: number;
};

const readCachedValue = (cacheKey: string) => {
  const now = Date.now();
  const memoryEntry = memoryCache.get(cacheKey);

  if (memoryEntry && memoryEntry.expiresAt > now) {
    return memoryEntry.data;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(`${CACHE_PREFIX}${cacheKey}`);

    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as CacheEntry;

    if (parsed.expiresAt <= now) {
      window.localStorage.removeItem(`${CACHE_PREFIX}${cacheKey}`);
      memoryCache.delete(cacheKey);
      return null;
    }

    memoryCache.set(cacheKey, parsed);
    return parsed.data;
  } catch {
    return null;
  }
};

const writeCachedValue = (cacheKey: string, data: unknown, ttlMs: number) => {
  const entry = {
    expiresAt: Date.now() + ttlMs,
    data,
  };

  memoryCache.set(cacheKey, entry);

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(`${CACHE_PREFIX}${cacheKey}`, JSON.stringify(entry));
  } catch {
    // Ignore storage quota and serialization failures.
  }
};

async function request(path: string, init?: RequestOptions) {
  if (init?.cacheKey) {
    const cachedValue = readCachedValue(init.cacheKey);

    if (cachedValue !== null) {
      return cachedValue;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : null) ?? `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (init?.cacheKey && data !== null) {
    writeCachedValue(init.cacheKey, data, init.ttlMs ?? 5 * 60 * 1000);
  }

  return data;
}

export const getCollectionData = (limit = 200, page = 1) =>
  request(`/data?limit=${limit}&page=${page}`, {
    cacheKey: `collection:${limit}:${page}`,
    ttlMs: 5 * 60 * 1000,
  });

export const searchCollectionCards = (query: string, limit: number, page = 1) =>
  request("/card", {
    method: "POST",
    body: JSON.stringify({ query, limit, page }),
    cacheKey: `search:${query.trim().toLowerCase()}:${limit}:${page}`,
    ttlMs: 2 * 60 * 1000,
  });

export const getCollectionCardById = (id: string) =>
  request(`/card/${id}`, {
    cacheKey: `card:${id}`,
    ttlMs: 10 * 60 * 1000,
  });
