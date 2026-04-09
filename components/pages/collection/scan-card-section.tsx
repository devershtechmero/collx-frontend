"use client";

import Image from "next/image";
import { Camera, Check, LoaderCircle, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ALL_CARDS, type Card } from "@/lib/mock/cards";
import { addCapturedCard } from "@/lib/store/collection-store";

const SCAN_DURATION_MS = 6000;
const COMPLETION_NOTICE_MS = 1200;

interface ScanCardSectionProps {
  scanCandidates: Card[];
}

export function ScanCardSection({ scanCandidates }: ScanCardSectionProps) {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCompletionNotice, setShowCompletionNotice] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showCaptureFlash, setShowCaptureFlash] = useState(false);
  const progressTimerRef = useRef<number | null>(null);
  const completionTimerRef = useRef<number | null>(null);
  const captureFlashTimerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const resolvedCandidates = useMemo(
    () => (scanCandidates.length > 0 ? scanCandidates : ALL_CARDS),
    [scanCandidates],
  );

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
      }
      if (completionTimerRef.current) {
        window.clearTimeout(completionTimerRef.current);
      }
      if (captureFlashTimerRef.current) {
        window.clearTimeout(captureFlashTimerRef.current);
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

  function openScanner() {
    setIsScannerOpen(true);
    setIsProcessing(false);
    setShowCompletionNotice(false);
    setProcessingProgress(0);
    setCapturedImage(null);
    setIsCameraReady(false);
    setShowCaptureFlash(false);
  }

  function resetTimers() {
    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    if (completionTimerRef.current) {
      window.clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }

    if (captureFlashTimerRef.current) {
      window.clearTimeout(captureFlashTimerRef.current);
      captureFlashTimerRef.current = null;
    }
  }

  function closeScanner() {
    resetTimers();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsScannerOpen(false);
    setIsProcessing(false);
    setShowCompletionNotice(false);
    setProcessingProgress(0);
    setCapturedImage(null);
    setIsCameraReady(false);
    setShowCaptureFlash(false);
  }

  function processScan() {
    if (isProcessing || !isCameraReady) {
      return;
    }

    const nextCard =
      resolvedCandidates[Math.floor(Math.random() * resolvedCandidates.length)] ??
      ALL_CARDS[0];
    const video = videoRef.current;

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const capturedFrame = canvas.toDataURL("image/jpeg", 0.92);

    resetTimers();
    setCapturedImage(capturedFrame);
    setIsProcessing(true);
    setShowCompletionNotice(false);
    setProcessingProgress(0);
    setShowCaptureFlash(true);

    captureFlashTimerRef.current = window.setTimeout(() => {
      setShowCaptureFlash(false);
      captureFlashTimerRef.current = null;
    }, 260);

    const startedAt = Date.now();
    progressTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(100, Math.round((elapsed / SCAN_DURATION_MS) * 100));

      setProcessingProgress(nextProgress);

      if (elapsed >= SCAN_DURATION_MS) {
        resetTimers();
        addCapturedCard(nextCard);
        setIsProcessing(false);
        setProcessingProgress(100);
        setShowCompletionNotice(true);

        completionTimerRef.current = window.setTimeout(() => {
          closeScanner();
        }, COMPLETION_NOTICE_MS);
      }
    }, 100);
  }

  useEffect(() => {
    if (!isScannerOpen) {
      return;
    }

    let isCancelled = false;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
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

        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setIsCameraReady(true);
      } catch {
        setIsCameraReady(false);
      }
    }

    startCamera();

    return () => {
      isCancelled = true;
    };
  }, [isScannerOpen]);

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
        <div className="fixed inset-0 z-50 bg-background">
          <div className="relative flex min-h-screen flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
            <button
              type="button"
              onClick={closeScanner}
              className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-current/15 bg-background/85 text-foreground shadow-[0_12px_36px_-18px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-colors hover:bg-foreground hover:text-background sm:right-6 sm:top-6"
              aria-label="Close scanner"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.18),transparent_34%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.12),transparent_30%)]" />

            <div className="relative flex flex-1 items-center justify-center">
              <div className="relative aspect-[5/7] w-full max-w-[320px] sm:max-w-[360px]">
                <div className="absolute inset-0 rounded-[2rem] border border-current/15 bg-foreground/[0.03] shadow-[0_35px_120px_-45px_rgba(15,23,42,0.45)] backdrop-blur-sm" />
                <div className="absolute inset-[14px] overflow-hidden rounded-[1.5rem] border border-current/12 bg-gradient-to-br from-foreground/[0.06] via-transparent to-foreground/[0.03]">
                  {capturedImage ? (
                    <Image
                      src={capturedImage}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 280px, 360px"
                      className={`object-cover transition-all duration-500 ${
                        isProcessing ? "scale-[1.03] saturate-125" : "scale-100 opacity-100"
                      }`}
                    />
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                      {!isCameraReady ? (
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.08),rgba(255,255,255,0.02),rgba(15,23,42,0.12))]" />
                      ) : null}
                    </>
                  )}

                  <div
                    className={`absolute inset-0 bg-white transition-opacity duration-200 ${
                      showCaptureFlash ? "opacity-95" : "opacity-0"
                    }`}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_48%,rgba(15,23,42,0.2)_100%)]" />
                  <div
                    className={`absolute inset-0 border-[3px] transition-all duration-300 ${
                      isProcessing
                        ? "border-emerald-300/95 shadow-[inset_0_0_0_1px_rgba(110,231,183,0.4)]"
                        : "border-white/65"
                    }`}
                  />
                  {isProcessing ? (
                    <>
                      <div className="absolute inset-4 rounded-[1.15rem] border border-emerald-300/40" />
                      <div className="absolute left-0 top-0 h-12 w-12 rounded-tl-[1.5rem] border-l-4 border-t-4 border-emerald-300/95" />
                      <div className="absolute right-0 top-0 h-12 w-12 rounded-tr-[1.5rem] border-r-4 border-t-4 border-emerald-300/95" />
                      <div className="absolute bottom-0 left-0 h-12 w-12 rounded-bl-[1.5rem] border-b-4 border-l-4 border-emerald-300/95" />
                      <div className="absolute bottom-0 right-0 h-12 w-12 rounded-br-[1.5rem] border-b-4 border-r-4 border-emerald-300/95" />
                      <div className="absolute inset-0 animate-pulse bg-emerald-300/8" />
                      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-emerald-300/35" />
                      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-emerald-300/28" />
                    </>
                  ) : null}
                  <div
                    className={`absolute inset-x-0 h-24 bg-gradient-to-b from-emerald-300/0 via-emerald-300/80 to-emerald-300/0 blur-md transition-transform duration-500 ${
                      isProcessing ? "translate-y-[320%]" : "-translate-y-full"
                    }`}
                  />
                  <div
                    className={`absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/18 to-transparent blur-xl transition-transform duration-700 ${
                      isProcessing ? "translate-x-[320px] sm:translate-x-[360px]" : "-translate-x-full"
                    }`}
                  />

                  {isProcessing ? (
                    <div className="absolute inset-0 bg-black/16" />
                  ) : null}
                </div>
              </div>
            </div>

            <div className="relative flex justify-center pb-4 pt-2 sm:pb-6">
              <button
                type="button"
                onClick={processScan}
                disabled={isProcessing}
                className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-current/15 bg-foreground text-background shadow-[0_20px_50px_-24px_rgba(15,23,42,0.7)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-80"
                aria-label="Send scan"
              >
                {isProcessing ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1">
              <div
                className="h-full bg-foreground transition-[width] duration-100"
                style={{ width: `${processingProgress}%` }}
              />
            </div>

            {showCompletionNotice ? (
              <div className="pointer-events-none absolute inset-x-0 top-6 z-20 flex justify-center px-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_20px_40px_-24px_rgba(16,185,129,0.85)]">
                  <Check className="h-4 w-4" />
                  <span>Scanning completed</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
