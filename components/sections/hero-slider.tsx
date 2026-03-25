"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { SLIDES } from "@/lib/constants/slider";

const AUTO_PLAY_INTERVAL_MS = 3000;

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % SLIDES.length);
    }, AUTO_PLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-12">
      <div className="relative overflow-hidden rounded-4xl border border-current/15">
        <div className="relative aspect-16/10 min-h-80 w-full sm:aspect-16/8 lg:min-h-130">
          {SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden={!isActive}
              >
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent dark:from-black/65 dark:via-black/20" />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                  <div className="max-w-xl space-y-3 text-white">
                    <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                      {slide.title}
                    </h2>
                    <p className="max-w-lg text-sm text-white/85 sm:text-base">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
