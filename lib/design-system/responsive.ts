/**
 * Responsive Utilities
 *
 * Hooks and utilities for responsive design in the IMENSIAH platform.
 */

"use client";

import { useState, useEffect } from "react";
import { breakpoints } from "./tokens";

// ============================================
// TYPES
// ============================================

export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

export type ResponsiveProp<T> = T | {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  "2xl"?: T;
};

// ============================================
// MEDIA QUERY HOOK
// ============================================

/**
 * Custom hook to match media queries
 * @param query - Media query string (e.g., "(min-width: 768px)")
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  // Return false during SSR to prevent hydration mismatch
  return mounted ? matches : false;
}

// ============================================
// BREAKPOINT HOOK
// ============================================

/**
 * Custom hook to get the current breakpoint
 * @returns Current breakpoint name or null during SSR
 */
export function useBreakpoint(): Breakpoint | null {
  const [mounted, setMounted] = useState(false);

  const is2xl = useMediaQuery(`(min-width: ${breakpoints["2xl"]})`);
  const isXl = useMediaQuery(`(min-width: ${breakpoints.xl})`);
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  const isMd = useMediaQuery(`(min-width: ${breakpoints.md})`);
  const isSm = useMediaQuery(`(min-width: ${breakpoints.sm})`);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (is2xl) return "2xl";
  if (isXl) return "xl";
  if (isLg) return "lg";
  if (isMd) return "md";
  if (isSm) return "sm";
  return null;
}

// ============================================
// RESPONSIVE PROP RESOLVER
// ============================================

/**
 * Resolves a responsive prop value to the current breakpoint value
 * @param prop - Responsive prop (value or object with breakpoint keys)
 * @param currentBreakpoint - Current breakpoint
 * @returns Resolved value for the current breakpoint
 */
export function resolveResponsiveProp<T>(
  prop: ResponsiveProp<T>,
  currentBreakpoint: Breakpoint | null
): T | undefined {
  // If prop is not an object, return it directly
  if (typeof prop !== "object" || prop === null || Array.isArray(prop)) {
    return prop as T;
  }

  const responsiveProp = prop as Record<string, T>;

  // Priority order: specific breakpoint > base > undefined
  const breakpointOrder: Array<Breakpoint | "base"> = ["2xl", "xl", "lg", "md", "sm", "base"];
  const currentIndex = currentBreakpoint ? breakpointOrder.indexOf(currentBreakpoint) : -1;

  // Try current breakpoint first, then fall back to smaller breakpoints
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (bp in responsiveProp) {
      return responsiveProp[bp];
    }
  }

  return undefined;
}

// ============================================
// VIEWPORT SIZE CHECKS
// ============================================

/**
 * Check if viewport is mobile (< md breakpoint)
 */
export function useIsMobile(): boolean {
  return !useMediaQuery(`(min-width: ${breakpoints.md})`);
}

/**
 * Check if viewport is tablet (md to lg)
 */
export function useIsTablet(): boolean {
  const isMd = useMediaQuery(`(min-width: ${breakpoints.md})`);
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg})`);
  return isMd && !isLg;
}

/**
 * Check if viewport is desktop (>= lg breakpoint)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${breakpoints.lg})`);
}

// ============================================
// VIEWPORT SIZE HOOK
// ============================================

export interface ViewportSize {
  width: number;
  height: number;
}

/**
 * Get current viewport dimensions
 * Returns { width: 0, height: 0 } during SSR
 */
export function useViewportSize(): ViewportSize {
  const [size, setSize] = useState<ViewportSize>({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return mounted ? size : { width: 0, height: 0 };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get CSS media query string for a breakpoint
 */
export function getMediaQuery(breakpoint: Breakpoint): string {
  return `(min-width: ${breakpoints[breakpoint]})`;
}

/**
 * Check if a breakpoint is active (client-side only)
 */
export function isBreakpointActive(breakpoint: Breakpoint): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(getMediaQuery(breakpoint)).matches;
}
