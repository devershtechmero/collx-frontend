"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, LoaderCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ALL_CARDS, type Card } from "@/lib/mock/cards";

const SCAN_DURATION_MS = 5000;

interface ScanCardSectionProps {
  scanCandidates: Card[];
}

export function ScanCardSection({ scanCandidates }: ScanCardSectionProps) {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [matchedCard, setMatchedCard] = useState<Card | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (processingTimerRef.current) {
        window.clearInterval(processingTimerRef.current);
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isScannerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isScannerOpen]);

  async function openScanner() {
    setIsScannerOpen(true);
    setCameraError(null);
    setMatchedCard(null);
    setProcessingProgress(0);
    setIsProcessing(false);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is not supported in this browser.");
      return;
    }

    try {
      streamRef.current?.getTracks().forEach((track) => track.stop());

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraReady(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setIsCameraReady(false);
      setCameraError("Camera permission was denied or no camera is available.");
    }
  }

  function closeScanner() {
    if (processingTimerRef.current) {
      window.clearInterval(processingTimerRef.current);
      processingTimerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsScannerOpen(false);
    setIsCameraReady(false);
    setIsProcessing(false);
    setProcessingProgress(0);
    setMatchedCard(null);
    setCameraError(null);
  }

  function processScan() {
    if (!isCameraReady || isProcessing) {
      return;
    }

    setMatchedCard(null);
    setIsProcessing(true);
    setProcessingProgress(0);

    const startedAt = Date.now();
    processingTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(100, Math.round((elapsed / SCAN_DURATION_MS) * 100));

      setProcessingProgress(nextProgress);

      if (elapsed >= SCAN_DURATION_MS) {
        if (processingTimerRef.current) {
          window.clearInterval(processingTimerRef.current);
          processingTimerRef.current = null;
        }
        setIsProcessing(false);
        setMatchedCard(
          scanCandidates[Math.floor(Math.random() * scanCandidates.length)] ?? ALL_CARDS[0],
        );
      }
    }, 100);
  }

  return (
    <>
      <button
        type="button"
        onClick={openScanner}
        className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-current/15 bg-background px-5 py-4 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background sm:w-auto"
      >
        <Camera className="h-4 w-4" />
        Scan your card
      </button>

      {isScannerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <button
            type="button"
            aria-label="Close scanner popup"
            className="absolute inset-0 bg-black/55 backdrop-blur-md"
            onClick={closeScanner}
          />

          <div className="relative z-10 flex max-h-[94svh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.75rem] border border-current/12 bg-background shadow-[0_40px_120px_-40px_rgba(0,0,0,0.75)] sm:rounded-[2.25rem]">
            <div className="flex items-start justify-between gap-4 border-b border-current/10 px-4 py-4 sm:px-6 sm:py-5">
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.04em] sm:text-2xl">
                  Live scanner
                </h3>
                <p className="mt-1 max-w-2xl text-xs text-foreground/64 sm:text-sm">
                  Allow camera access, center the card in the rectangle, then press
                  process to simulate recognition.
                </p>
              </div>

              <button
                type="button"
                onClick={closeScanner}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/15 text-foreground transition-colors hover:bg-foreground hover:text-background"
                aria-label="Close scanner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 overflow-y-auto p-4 sm:gap-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-current/12 bg-black sm:rounded-4xl">
                <div className="relative aspect-[4/5] min-h-[320px] sm:aspect-video sm:min-h-[420px]">
                  {cameraError ? (
                    <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-white/80">
                      {cameraError}
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="h-full w-full object-cover opacity-85"
                    />
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-black/30" />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-[5/7] w-[180px] max-w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-[1.4rem] border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.42)] sm:w-[280px] sm:rounded-3xl">
                    <div className="absolute inset-2 rounded-2xl border border-dashed border-white/60 sm:inset-3 sm:rounded-2xl" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-[1.75rem] border border-current/12 bg-foreground/3 p-4 sm:rounded-4xl sm:p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/54">
                    Scanner
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground/68">
                    Keep the card steady inside the centered rectangle for the best
                    simulated match.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.16em] text-foreground/52">
                    <span>Scan progress</span>
                    <span>{processingProgress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                    <div
                      className="h-full rounded-full bg-foreground transition-[width] duration-100"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>
                </div>

                {matchedCard ? (
                  <div className="rounded-[1.4rem] border border-current/12 bg-background p-4 sm:rounded-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/52">
                      Match found
                    </p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <div className="relative h-24 w-18 shrink-0 overflow-hidden rounded-xl border border-current/10">
                        <Image
                          src={matchedCard.image}
                          alt={matchedCard.name}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 space-y-2">
                        <p className="text-sm font-semibold sm:truncate">{matchedCard.name}</p>
                        <p className="text-xs text-foreground/60 sm:truncate">
                          {matchedCard.description}
                        </p>
                        <Link
                          href={`/collection/${matchedCard.id}`}
                          className="inline-flex w-full items-center justify-center rounded-full border border-current/15 px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background sm:w-auto sm:py-1.5"
                        >
                          Reveal card
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-foreground/58">
                    After processing, the scanner will reveal a matching card from the
                    current card catalog.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-current/10 px-4 py-4 sm:flex-row sm:justify-end sm:px-6 sm:py-5">
              <button
                type="button"
                onClick={closeScanner}
                className="inline-flex w-full items-center justify-center rounded-full border border-current/15 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={processScan}
                disabled={!isCameraReady || isProcessing || !!cameraError}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-current/15 bg-foreground px-5 py-3 text-sm font-semibold text-background transition-colors disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
              >
                {isProcessing ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Process"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
