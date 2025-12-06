/**
 * Design System Tokens
 *
 * Centralized design tokens for the IMENSIAH platform.
 * These tokens define the visual language and are consumed by Tailwind config.
 */

// ============================================
// COLOR TOKENS
// ============================================

export const colors = {
  navy: {
    50: "#F0F3F7",
    100: "#E1E7EF",
    200: "#C3CFE0",
    300: "#A5B7D0",
    400: "#879FC1",
    500: "#6987B1",
    600: "#4B6FA2",
    700: "#1F2937",
    800: "#162032",
    900: "#0A101D",
  },
  gold: {
    50: "#FAF8F3",
    100: "#F5F1E7",
    200: "#EBE5D9",
    300: "#D4C9AD",
    400: "#BDAD81",
    500: "#B89E68",
    600: "#A18852",
    700: "#8A723C",
  },
  surface: {
    paper: "#F7F6F4",
    white: "#FFFFFF",
    border: "#E5E0D6",
  },
  line: "#E5E0D6",
  text: {
    primary: "#111827",
    secondary: "#52525B",
    tertiary: "#71717A",
  },
  // Semantic colors
  semantic: {
    success: {
      light: "#D1FAE5",
      DEFAULT: "#10B981",
      dark: "#065F46",
    },
    warning: {
      light: "#FEF3C7",
      DEFAULT: "#F59E0B",
      dark: "#92400E",
    },
    error: {
      light: "#FEE2E2",
      DEFAULT: "#EF4444",
      dark: "#991B1B",
    },
    info: {
      light: "#DBEAFE",
      DEFAULT: "#3B82F6",
      dark: "#1E40AF",
    },
  },
} as const;

// ============================================
// SPACING SCALE
// ============================================

export const spacing = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
  40: "10rem", // 160px
  48: "12rem", // 192px
  64: "16rem", // 256px
} as const;

// ============================================
// TYPOGRAPHY TOKENS
// ============================================

export const fontSize = {
  xs: "0.625rem", // 10px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
  "7xl": "4.5rem", // 72px
} as const;

export const fontWeight = {
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const lineHeight = {
  none: "1",
  tight: "1.1",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
} as const;

export const letterSpacing = {
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.15em",
  ultra: "0.2em",
} as const;

export const fontFamily = {
  heading: ["var(--font-heading)", "sans-serif"] as string[],
  body: ["var(--font-body)", "sans-serif"] as string[],
  sans: ["var(--font-body)", "sans-serif"] as string[],
};

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  none: "0px",
  sm: "2px",
  md: "4px",
  full: "9999px",
} as const;

// ============================================
// SHADOWS
// ============================================

export const boxShadow = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  none: "none",
} as const;

// ============================================
// Z-INDEX SCALE
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
} as const;

// ============================================
// TRANSITIONS & ANIMATIONS
// ============================================

export const transitionDuration = {
  fast: "150ms",
  base: "200ms",
  slow: "300ms",
  slower: "500ms",
} as const;

export const transitionTimingFunction = {
  ease: "ease",
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
  linear: "linear",
} as const;

export const animation = {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
  "fade-in": "fade-in 0.2s ease-out",
  "fade-out": "fade-out 0.2s ease-out",
  "slide-in": "slide-in 0.3s ease-out",
  "slide-out": "slide-out 0.3s ease-out",
} as const;

export const keyframes = {
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },
  "fade-in": {
    from: { opacity: "0" },
    to: { opacity: "1" },
  },
  "fade-out": {
    from: { opacity: "1" },
    to: { opacity: "0" },
  },
  "slide-in": {
    from: { transform: "translateY(-10px)", opacity: "0" },
    to: { transform: "translateY(0)", opacity: "1" },
  },
  "slide-out": {
    from: { transform: "translateY(0)", opacity: "1" },
    to: { transform: "translateY(-10px)", opacity: "0" },
  },
} as const;

// ============================================
// CONTAINER
// ============================================

export const container = {
  maxWidth: "1400px",
} as const;
