"use client";

import { useState } from "react";
import { MY_COLLECTION, type Card } from "@/lib/mock/cards";
import { Heart, Bookmark, Grid, DollarSign, Wallet, Search } from "lucide-react";
import { CardItem } from "@/components/shared/cards/card-item";
import { getCapturedCards } from "@/lib/store/collection-store";
import { useEffect } from "react";

type Tab = "my-collection" | "saved" | "liked";

export default function CollectionPage() {
  const [activeTab, setActiveTab] = useState<Tab>("my-collection");
  const [collection, setCollection] = useState<Card[]>([]);

  useEffect(() => {
    const captured = getCapturedCards();
    setCollection([...captured, ...MY_COLLECTION]);
  }, []);

  const TABS = [
    { id: "my-collection", label: "My Collection", icon: Grid },
    { id: "saved", label: "Saved", icon: Bookmark },
    { id: "liked", label: "Liked", icon: Heart }
  ];

  const totalValue = collection.reduce((acc, card) => acc + card.price, 0);

  return (
    <div className="h-full flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Your Collection</h2>
      </div>

      {/* Sub-navigation */}
      <nav className="flex gap-2 p-1 bg-current/5 rounded-2.5xl w-full overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                isActive ? "bg-background text-foreground shadow-sm" : "text-foreground/50 hover:text-foreground"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {activeTab === "my-collection" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collection.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-foreground/40 space-y-4">
            <div className="p-6 bg-current/5 rounded-full">
              <Search size={48} strokeWidth={1} />
            </div>
            <p className="text-xl font-medium">No items found in {TABS.find(t => t.id === activeTab)?.label}</p>
          </div>
        )}
      </div>

      {/* Stats Floating Bar */}
      {/* <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-2xl z-20">
        <div className="bg-background/80 text-foreground rounded-full px-8 py-6 shadow-2xl flex items-center justify-between border border-current/10 backdrop-blur-xl">
          <div className="flex items-center gap-8">
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">Total Cards</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{collection.length}</span>
                <span className="text-[10px] font-bold opacity-30">PCS</span>
              </div>
            </div>
            <div className="w-px h-10 bg-current/10" />
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">Est. Market Value</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">${totalValue.toLocaleString()}</span>
                <span className="text-[10px] font-bold opacity-30">USD</span>
              </div>
            </div>
          </div>
          
          <button className="bg-foreground text-background px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
            <Wallet size={16} />
            <span>Manage Assets</span>
          </button>
        </div>
      </div> */}
    </div>
  );
}
