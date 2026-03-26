"use client";

import { useEffect, useRef, useState } from "react";
import { Scan, ChevronLeft, ChevronRight, TrendingUp, DollarSign } from "lucide-react";
import { TRENDING_CARDS } from "@/lib/mock/cards";
import { CardItem } from "@/components/shared/cards/card-item";

export default function DashboardHome() {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startScan = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access denied or not available.");
      setIsScanning(false);
    }
  };

  const stopScan = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Scanner Section */}
      <section className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-current/5 text-foreground p-6 md:p-12 lg:p-16 border border-current/10">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 md:mb-6">Scan Your Cards</h2>
          <p className="text-foreground/70 text-base md:text-lg mb-8 md:mb-10 leading-relaxed max-w-md">
            Instantly identify your cards and get real-time market values. 
            Works with Pokemon, Sports cards, and more.
          </p>
          
          <button
            onClick={isScanning ? stopScan : startScan}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 rounded-full font-bold text-base md:text-lg transition-all hover:scale-105 active:scale-95"
          >
            <Scan className={`${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "Stop Scanner" : "Start Scanning"}</span>
          </button>
        </div>

        {/* Camera Preview Overlay */}
        {isScanning && (
          <div className="absolute inset-0 z-0">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          </div>
        )}

        {/* Decorative Grid */}
        <div className="absolute top-0 right-0 w-1/2 md:w-1/3 h-full opacity-5 md:opacity-10 pointer-events-none">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] border border-current/20 rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Cards Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-foreground/5 rounded-xl">
              <TrendingUp className="text-foreground" size={20} />
            </div>
            <h3 className="text-2xl font-bold">Trending Now</h3>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => scroll("left")}
              className="p-3 rounded-full border border-current/10 hover:bg-current/5 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="p-3 rounded-full border border-current/10 hover:bg-current/5 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar"
        >
          {TRENDING_CARDS.map((card, index) => (
            <div key={card.id} className="flex-none w-[280px] snap-start">
              <CardItem card={card} rank={index + 1} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
