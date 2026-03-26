"use client";

import { Heart, Bookmark } from "lucide-react";
import { useState } from "react";

interface CardItemProps {
  card: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
  rank?: number;
  showDetails?: boolean;
}

export function CardItem({ card, rank, showDetails = true }: CardItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="group relative">
      <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-4 bg-foreground/5 border border-current/5">
        <img 
          src={card.image} 
          alt={card.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Interaction Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 ${
              isLiked ? "bg-pink-500 text-white" : "bg-background/80 text-foreground"
            }`}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className={`p-3 rounded-full backdrop-blur-md shadow-lg transition-all hover:scale-110 ${
              isSaved ? "bg-blue-500 text-white" : "bg-background/80 text-foreground"
            }`}
          >
            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        {rank && (
          <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
            #{rank}
          </div>
        )}

        {showDetails && (
          <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
            <button className="bg-background text-foreground px-4 py-2 rounded-full text-xs font-medium shadow-xl">
              See Details
            </button>
          </div>
        )}
      </div>

      <div className="space-y-1 px-2">
        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider">{card.category}</p>
        <h4 className="font-bold truncate text-foreground group-hover:text-primary transition-colors">{card.name}</h4>
        <div className="flex items-center gap-1 font-bold text-lg">
          <span className="text-foreground/40 text-sm">$</span>
          <span>{card.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
