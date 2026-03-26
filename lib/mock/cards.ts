export interface Card {
  id: string;
  name: string;
  price: number;
  image: string;
  rank?: number;
  category: string;
  player?: string;
  set?: string;
  rarity?: string;
  change?: string;
  isTrending?: boolean;
}

export const TRENDING_CARDS: Card[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `trending-${i + 1}`,
  name: i % 2 === 0 ? `Charizard Base Set #${i + 1}` : `LeBron James Rookie Card #${i + 1}`,
  price: 1200 + i * 500,
  image: `https://picsum.photos/seed/${i + 100}/300/400`,
  rank: i + 1,
  category: i % 2 === 0 ? "Pokemon" : "Sports",
}));

export const MY_COLLECTION: Card[] = [
  { id: "my-1", name: "Pikachu Illustrator", price: 50000, image: "https://picsum.photos/seed/pika/300/400", category: "Pokemon" },
  { id: "my-2", name: "Michael Jordan 1986 Fleer", price: 15000, image: "https://picsum.photos/seed/mj/300/400", category: "Sports" },
  { id: "my-3", name: "Black Lotus", price: 30000, image: "https://picsum.photos/seed/lotus/300/400", category: "MTG" },
];

export const CATEGORIES = ["Pokemon", "Sports", "MTG", "Yu-Gi-Oh", "Baseball", "Basketball"];
