"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

/* ============================================
   LOADING INDICATOR - Top Page Loading Bar
   ============================================

   A YouTube-style loading bar that appears at the
   top of the page during route changes.

   Usage: Add to root layout component
   ============================================ */

export function LoadingIndicator() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start loading animation on route change
    setLoading(true);
    setProgress(0);

    // Simulate progress
    const timer1 = setTimeout(() => setProgress(30), 100);
    const timer2 = setTimeout(() => setProgress(60), 300);
    const timer3 = setTimeout(() => setProgress(90), 600);

    // Complete after route change
    const timer4 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-[9999] bg-transparent"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full bg-gradient-to-r from-[#00a859] to-[#00d46e]",
          "transition-all duration-300 ease-out",
          "shadow-[0_0_10px_rgba(0,168,89,0.5)]"
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* ============================================
   SPINNER ICON - For Button Loading States
   ============================================ */

interface SpinnerProps {
  className?: string;
  size?: number;
}

export function Spinner({ className, size = 16 }: SpinnerProps) {
  return (
    <svg
      className={cn("animate-spin", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
