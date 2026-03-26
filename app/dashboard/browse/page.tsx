"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ArrowRight } from "lucide-react";
import { CATEGORIES, TRENDING_CARDS } from "@/lib/mock/cards";
import { CardItem } from "@/components/shared/cards/card-item";

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCards = useMemo(() => {
    return TRENDING_CARDS.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || card.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="space-y-10">
      <div className="max-w-3xl space-y-4">
        <h2 className="text-3xl font-bold">Browse Marketplace</h2>
        <p className="text-foreground/60">Search through millions of cards from collectors worldwide.</p>
      </div>

      {/* Search Bar - Full Width */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-foreground transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search cards, sets, or players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-current/5 border border-transparent rounded-[2rem] pl-14 pr-6 py-5 outline-none focus:bg-background focus:border-current/10 transition-all text-lg"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-none px-6 py-3 rounded-full text-sm font-bold transition-all border ${
              activeCategory === cat 
              ? "bg-foreground text-background border-foreground" 
              : "border-current/10 hover:border-current/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredCards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="p-8 bg-current/5 w-fit mx-auto rounded-full mb-6">
            <Filter size={48} className="opacity-10" />
          </div>
          <p className="text-2xl font-bold text-foreground/20">No matching cards found</p>
          <button 
            onClick={() => {setSearch(""); setActiveCategory("All");}}
            className="text-sm font-bold underline underline-offset-4"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
