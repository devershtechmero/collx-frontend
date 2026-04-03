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
    <div className="rounded-[2.25rem] border border-current/12 bg-foreground/3 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          {/* <p className="text-sm font-medium uppercase tracking-[0.22em] text-foreground/58">
            Card Scanner
          </p> */}
          <h2 className="text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
            Scan your card inside the collection flow
          </h2>
          <p className="text-sm leading-7 text-foreground/68 sm:text-base">
            Open the camera, align the card in the frame, and simulate a scan
            that reveals a matching item from your catalog.
          </p>
        </div>

        <button
          type="button"
          onClick={openScanner}
          className="inline-flex items-center gap-2 rounded-full border border-current/15 bg-background px-5 py-3 text-sm font-semibold transition-colors hover:bg-foreground hover:text-background"
        >
          <Camera className="h-4 w-4" />
          Scan your card
        </button>
      </div>

      {isScannerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close scanner popup"
            className="absolute inset-0 bg-black/55 backdrop-blur-md"
            onClick={closeScanner}
          />

          <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2.25rem] border border-current/12 bg-background shadow-[0_40px_120px_-40px_rgba(0,0,0,0.75)]">
            <div className="flex items-start justify-between gap-4 border-b border-current/10 px-5 py-5 sm:px-6">
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
                  Live scanner
                </h3>
                <p className="mt-1 text-sm text-foreground/64">
                  Allow camera access, center the card in the rectangle, then press
                  process to simulate recognition.
                </p>
              </div>

              <button
                type="button"
                onClick={closeScanner}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/15"
                aria-label="Close scanner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-5 overflow-y-auto p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="relative overflow-hidden rounded-4xl border border-current/12 bg-black">
                <div className="relative aspect-video min-h-90 sm:min-h-105">
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
                  <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-5/7 w-60 max-w-[58vw] -translate-x-1/2 -translate-y-1/2 rounded-3xl border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.42)] sm:w-70">
                    <div className="absolute inset-3 rounded-2xl border border-dashed border-white/60" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-4xl border border-current/12 bg-foreground/3 p-5">
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
                  <div className="rounded-3xl border border-current/12 bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/52">
                      Match found
                    </p>
                    <div className="mt-3 flex gap-3">
                      <div className="relative h-24 w-18 shrink-0 overflow-hidden rounded-xl border border-current/10">
                        <Image src={matchedCard.image} alt={matchedCard.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 space-y-2">
                        <p className="truncate text-sm font-semibold">{matchedCard.name}</p>
                        <p className="truncate text-xs text-foreground/60">
                          {matchedCard.description}
                        </p>
                        <Link
                          href={`/collection/${matchedCard.id}`}
                          className="inline-flex rounded-full border border-current/15 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-foreground hover:text-background"
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

            <div className="flex flex-col-reverse gap-3 border-t border-current/10 px-5 py-5 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={closeScanner}
                className="inline-flex items-center justify-center rounded-full border border-current/15 px-5 py-3 text-sm font-semibold transition-colors hover:bg-foreground hover:text-background"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={processScan}
                disabled={!isCameraReady || isProcessing || !!cameraError}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-current/15 bg-foreground px-5 py-3 text-sm font-semibold text-background transition-colors disabled:cursor-not-allowed disabled:opacity-45"
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
    </div>
  );
}
