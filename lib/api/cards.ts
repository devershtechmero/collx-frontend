const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3030/api";

async function request(path: string, init?: RequestInit) {
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

  return data;
}

export const getCollectionData = (limit = 200, page = 1) =>
  request(`/data?limit=${limit}&page=${page}`);

export const searchCollectionCards = (query: string, limit: number, page = 1) =>
  request("/card", {
    method: "POST",
    body: JSON.stringify({ query, limit, page }),
  });

export const getCollectionCardById = (id: string) =>
  request(`/card/${id}`);
