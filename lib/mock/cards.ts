export interface Card {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  dateAdded?: string;
  rank?: number;
  category: string;
  player?: string;
  set?: string;
  rarity?: string;
  change?: string;
  isTrending?: boolean;
}

export const CATEGORIES = [
  "Baseball",
  "Football",
  "Basketball",
  "Hockey",
  "Soccer",
  "Wrestling",
  "Racing",
  "Multi-Sport",
  "MMA",
  "Golf",
  "Tennis",
  "Boxing",
  "Skateboarding",
  "Skating",
  "Cycling",
  "Olympics",
  "Volleyball",
  "Lacrosse",
  "Cricket",
  "Snowboarding",
] as const;

const CATEGORY_PLAYERS: Record<(typeof CATEGORIES)[number], string[]> = {
  Baseball: ["Shohei Ohtani", "Aaron Judge", "Mookie Betts", "Ronald Acuna Jr."],
  Football: ["Patrick Mahomes", "Josh Allen", "C.J. Stroud", "Justin Jefferson"],
  Basketball: ["LeBron James", "Stephen Curry", "Victor Wembanyama", "Jayson Tatum"],
  Hockey: ["Connor McDavid", "Auston Matthews", "Nathan MacKinnon", "Sidney Crosby"],
  Soccer: ["Lionel Messi", "Kylian Mbappe", "Erling Haaland", "Jude Bellingham"],
  Wrestling: ["Roman Reigns", "Cody Rhodes", "Seth Rollins", "Bianca Belair"],
  Racing: ["Max Verstappen", "Lewis Hamilton", "Lando Norris", "Charles Leclerc"],
  "Multi-Sport": ["Iconic Legends", "Rising Stars", "Global Icons", "Champions Mix"],
  MMA: ["Conor McGregor", "Islam Makhachev", "Alex Pereira", "Sean O'Malley"],
  Golf: ["Tiger Woods", "Rory McIlroy", "Scottie Scheffler", "Nelly Korda"],
  Tennis: ["Novak Djokovic", "Carlos Alcaraz", "Iga Swiatek", "Coco Gauff"],
  Boxing: ["Canelo Alvarez", "Terence Crawford", "Naoya Inoue", "Tyson Fury"],
  Skateboarding: ["Tony Hawk", "Nyjah Huston", "Leticia Bufoni", "Yuto Horigome"],
  Skating: ["Yuzuru Hanyu", "Nathan Chen", "Kaori Sakamoto", "Ilia Malinin"],
  Cycling: ["Tadej Pogacar", "Jonas Vingegaard", "Mathieu van der Poel", "Wout van Aert"],
  Olympics: ["Simone Biles", "Katie Ledecky", "Noah Lyles", "Sydney McLaughlin-Levrone"],
  Volleyball: ["Karch Kiraly", "Mikasa Elite", "Earvin Ngapeth", "Paola Egonu"],
  Lacrosse: ["Lyle Thompson", "Tom Schreiber", "Charlotte North", "Tre Leclaire"],
  Cricket: ["Virat Kohli", "MS Dhoni", "Pat Cummins", "Jos Buttler"],
  Snowboarding: ["Shaun White", "Chloe Kim", "Mark McMorris", "Ayumu Hirano"],
};

const CARD_SERIES = [
  "Chrome Flash",
  "Prizm Gold",
  "Heritage Ink",
  "Midnight Foil",
  "Legacy Patch",
  "Rookie Rise",
];

const CARD_RARITIES = ["Common", "Rare", "Ultra Rare", "Signature", "Gem Mint"];

const CARD_DESCRIPTORS = [
  "Sharp corners, centered finish, and collectible shine.",
  "Clean one-line listing built for quick browsing.",
  "Premium surface with standout color and strong demand.",
  "Popular release with collector-friendly value movement.",
  "High-interest card with crisp print and modern styling.",
  "A fan-favorite issue with reliable shelf appeal.",
];

export const ALL_CARDS: Card[] = Array.from({ length: 120 }).map((_, index) => {
  const category = CATEGORIES[index % CATEGORIES.length];
  const players = CATEGORY_PLAYERS[category];
  const player = players[index % players.length];
  const series = CARD_SERIES[index % CARD_SERIES.length];
  const rarity = CARD_RARITIES[index % CARD_RARITIES.length];
  const cardNumber = String((index % 80) + 1).padStart(2, "0");

  return {
    id: `card-${index + 1}`,
    name: `${player} ${series} #${cardNumber}`,
    price: 95 + ((index * 37) % 1900),
    image: `https://picsum.photos/seed/collx-card-${index + 1}/600/800`,
    description: CARD_DESCRIPTORS[index % CARD_DESCRIPTORS.length],
    dateAdded: new Date(2026, 2, 30 - (index % 25)).toISOString(),
    rank: index + 1,
    category,
    player,
    set: `${new Date(2021 + (index % 5), 0, 1).getFullYear()} ${series}`,
    rarity,
    change: `${index % 2 === 0 ? "+" : "-"}${((index % 9) + 1) * 1.3}%`,
    isTrending: index < 12,
  };
});

export const TRENDING_CARDS: Card[] = ALL_CARDS.filter((card) => card.isTrending).slice(0, 10);

export const MY_COLLECTION: Card[] = ALL_CARDS.slice(0, 12).map((card, index) => ({
  ...card,
  id: `my-${index + 1}`,
  dateAdded: new Date(2026, 2, 28 - index).toISOString(),
}));
