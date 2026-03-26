"use client";

import { useEffect, useRef, useState } from "react";
import { TRENDING_CARDS, type Card } from "@/lib/mock/cards";
import { CardItem } from "@/components/shared/cards/card-item";
import { addCapturedCard } from "@/lib/store/collection-store";
import { X, Camera, CheckCircle2, Loader2, ChevronLeft, ChevronRight, TrendingUp, Scan } from "lucide-react";
import { toast } from "sonner";

export default function DashboardHome() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<"idle" | "capturing" | "identifying" | "review" | "success">("idle");
  const [scannedCard, setScannedCard] = useState<Card | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startScan = async () => {
    try {
      setScanStatus("idle");
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Camera access denied or not available. Please check your permissions.");
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
    setScanStatus("idle");
  };

  const captureCard = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setScanStatus("capturing");
    
    // Take snapshot
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");

      // Simulate identification process
      setScanStatus("identifying");
      setTimeout(() => {
        const identifiedCard: Card = {
          id: `scanned-${Date.now()}`,
          name: "Blue-Eyes White Dragon",
          player: "Kaiba Spec",
          set: "Legend of Blue Eyes White Dragon",
          rarity: "Ultra Rare",
          category: "Yu-Gi-Oh",
          price: Math.floor(Math.random() * 500) + 150,
          image: imageData,
          change: "+5.4%",
          isTrending: true
        };
        setScannedCard(identifiedCard);
        setScanStatus("review");
      }, 1500);
    }
  };

  const confirmAddCard = () => {
    if (scannedCard) {
      addCapturedCard(scannedCard);
      setScanStatus("success");
      toast.success("Card identified and added to your collection!");
      
      // Auto close after success
      setTimeout(() => {
        stopScan();
        setScannedCard(null);
      }, 2000);
    }
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
      {/* Scanner Hero */}
      <section className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-current/5 text-foreground p-6 md:p-12 lg:p-16 border border-current/10">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 md:mb-6">Scan Your Cards</h2>
          <p className="text-foreground/70 text-base md:text-lg mb-8 md:mb-10 leading-relaxed max-w-md">
            Instantly identify your cards and get real-time market values. 
            Now with full-resolution capture and collection sync.
          </p>
          
          <button
            onClick={startScan}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 rounded-full font-bold text-base md:text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-foreground/10"
          >
            <Camera size={24} />
            <span>Start Scanning</span>
          </button>
        </div>

        {/* Decorative Grid */}
        <div className="absolute top-0 right-0 w-1/2 md:w-1/3 h-full opacity-5 md:opacity-10 pointer-events-none">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] border border-current/20 rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      {/* Full-Screen Scanner Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-500">
          <button 
            onClick={stopScan}
            className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all z-10"
          >
            <X size={24} />
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="h-full w-full object-cover"
            />
            
            {/* Scanner UI Overlays */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Aiming Box */}
              {scanStatus === "idle" && (
                <div className="relative w-72 h-[500px] md:w-80 md:h-[500px] border-2 border-white/50 rounded-3xl shadow-[0_0_0_100vw_rgba(0,0,0,0.6)]">
                  <div className="absolute inset-0 border-2 border-primary/40 rounded-3xl animate-pulse" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-4 text-center w-full">
                    <p className="text-white font-bold text-sm tracking-widest uppercase bg-black/40 px-4 py-1 rounded-full backdrop-blur-md inline-block">
                      Position card within frame
                    </p>
                  </div>
                </div>
              )}

              {/* Action UI */}
              <div className="absolute bottom-12 w-full flex flex-col items-center gap-6">
                {scanStatus === "idle" && (
                  <button 
                    onClick={captureCard}
                    className="w-20 h-20 bg-white rounded-full border-4 border-white/20 flex items-center justify-center shadow-2xl active:scale-90 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-black group-hover:scale-95 transition-all" />
                  </button>
                )}

                {scanStatus === "identifying" && (
                  <div className="flex flex-col items-center gap-4 bg-black/60 p-6 rounded-3xl backdrop-blur-md border border-white/10">
                    <Loader2 className="animate-spin text-primary" size={40} />
                    <p className="text-white font-bold tracking-tight">Identifying Card...</p>
                  </div>
                )}

                {scanStatus === "review" && scannedCard && (
                  <div className="flex flex-col items-center gap-6 bg-background p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] w-[90%] max-w-sm animate-in zoom-in-95 duration-300 shadow-2xl border border-current/10 max-h-[90vh] overflow-y-auto no-scrollbar">
                    <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-current/5 shrink-0">
                      <img src={scannedCard.image} className="w-full h-full object-cover" alt="Scanned Card" />
                    </div>
                    
                    <div className="w-full space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40 px-1">Card Name</label>
                        <input 
                          type="text" 
                          value={scannedCard.name}
                          onChange={(e) => setScannedCard({...scannedCard, name: e.target.value})}
                          className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 font-bold text-foreground focus:ring-2 ring-primary/20 transition-all outline-none"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-foreground/40 px-1">Market Price (USD)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-foreground/40">$</span>
                          <input 
                            type="number" 
                            value={scannedCard.price}
                            onChange={(e) => setScannedCard({...scannedCard, price: Number(e.target.value)})}
                            className="w-full bg-foreground/5 border-none rounded-xl pl-8 pr-4 py-3 font-bold text-foreground focus:ring-2 ring-primary/20 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={confirmAddCard}
                      className="w-full bg-foreground text-background py-4 rounded-full font-bold text-base md:text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-foreground/10 flex items-center justify-center gap-2"
                    >
                      <Scan size={20} />
                      <span>Add to Collection</span>
                    </button>
                    
                    <button 
                      onClick={() => { setScanStatus("idle"); setScannedCard(null); }}
                      className="text-xs font-bold text-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest"
                    >
                      Discard & Retake
                    </button>
                  </div>
                )}

                {scanStatus === "success" && (
                  <div className="flex flex-col items-center gap-4 bg-green-500/90 p-8 rounded-3xl backdrop-blur-md animate-in zoom-in-95 duration-300">
                    <CheckCircle2 className="text-white" size={48} />
                    <div className="text-center">
                      <p className="text-white font-bold text-xl">Card Captured!</p>
                      <p className="text-white/80 text-sm">Added to your collection</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

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
