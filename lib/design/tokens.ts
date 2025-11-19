/**
 * IMENSIAH Design Tokens
 * Single source of truth for all colors, typography, spacing, and design values
 *
 * RULE: ALL components MUST import from this file
 * RULE: NO hardcoded colors, sizes, or design values in components
 * RULE: Colors are semantic - use purpose-based tokens, not raw values
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

export const colors = {
  // Brand Colors (Primary: Ocean Blue, Accent: Gold)
  brand: {
    primary: {
      DEFAULT: 'hsl(195 100% 8%)',      // Ocean Blue #001A2E
      foreground: 'hsl(0 0% 100%)',     // White text on ocean blue
    },
    accent: {
      DEFAULT: 'hsl(45 100% 55%)',      // Gold #FFC107
      foreground: 'hsl(195 100% 8%)',   // Ocean blue text on gold
    },
  },

  // Semantic Colors (Use these for UI elements)
  semantic: {
    background: 'hsl(0 0% 100%)',       // White background
    foreground: 'hsl(195 100% 5%)',     // Almost black text

    muted: {
      DEFAULT: 'hsl(195 20% 96%)',      // Light gray background
      foreground: 'hsl(195 15% 45%)',   // Muted text
    },

    border: 'hsl(195 20% 90%)',         // Light border
    input: 'hsl(195 20% 90%)',          // Input border
    ring: 'hsl(45 100% 55%)',           // Focus ring (gold)
  },

  // Component Colors
  card: {
    DEFAULT: 'hsl(0 0% 100%)',          // White card
    foreground: 'hsl(195 100% 5%)',     // Dark text
  },

  // Status Colors
  status: {
    success: 'hsl(142 76% 36%)',        // Green
    warning: 'hsl(38 92% 50%)',         // Orange/Yellow
    error: 'hsl(0 84% 60%)',            // Red
    info: 'hsl(217 91% 60%)',           // Blue
  },

  // Interactive States
  interactive: {
    hover: 'hsl(45 100% 50%)',          // Slightly darker gold
    active: 'hsl(45 100% 45%)',         // Even darker gold
    disabled: 'hsl(195 20% 70%)',       // Gray
  },
} as const;

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export const typography = {
  fontFamily: {
    sans: 'var(--font-sans)',           // Inter
    serif: 'var(--font-serif)',         // Work Sans
  },

  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const;

// ============================================================================
// SPACING TOKENS
// ============================================================================

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
} as const;

// ============================================================================
// RADIUS TOKENS
// ============================================================================

export const radius = {
  none: '0',
  sm: 'calc(0.75rem - 4px)',    // 8px
  md: 'calc(0.75rem - 2px)',    // 10px
  lg: '0.75rem',                // 12px
  xl: '1rem',                   // 16px
  '2xl': '1.5rem',              // 24px
  full: '9999px',               // Fully rounded
} as const;

// ============================================================================
// SHADOW TOKENS
// ============================================================================

export const shadows = {
  soft: '0 2px 8px rgba(0, 26, 46, 0.08)',
  medium: '0 4px 16px rgba(0, 26, 46, 0.12)',
  strong: '0 8px 24px rgba(0, 26, 46, 0.16)',
  glow: '0 0 20px rgba(255, 193, 7, 0.3)',      // Gold glow
} as const;

// ============================================================================
// GRADIENT TOKENS
// ============================================================================

export const gradients = {
  hero: 'linear-gradient(135deg, #001A2E 0%, #002A45 50%, #003A5C 100%)',
  imensiah: 'linear-gradient(135deg, #001A2E 0%, #003A5C 50%, #FFC107 100%)',
  subtle: 'linear-gradient(135deg, #F5F8FA 0%, #E8EFF5 50%, #DBE5EF 100%)',
} as const;

// ============================================================================
// BREAKPOINT TOKENS
// ============================================================================

export const breakpoints = {
  sm: '640px',    // Tablet portrait
  md: '768px',    // Tablet landscape
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px', // Extra large desktop
} as const;

// ============================================================================
// ANIMATION TOKENS
// ============================================================================

export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a color token by path
 * @example getColor('brand.primary.DEFAULT') => 'hsl(195 100% 8%)'
 */
export function getColor(path: string): string {
  const parts = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = colors;

  for (const part of parts) {
    value = value[part];
    if (value === undefined) {
      console.error(`Color token not found: ${path}`);
      return colors.brand.primary.DEFAULT;
    }
  }

  return value;
}

/**
 * Get CSS variable for a color
 * @example getCSSVar('primary') => 'hsl(var(--primary))'
 */
export function getCSSVar(name: string): string {
  return `hsl(var(--${name}))`;
}

// ============================================================================
// TYPE EXPORTS (for TypeScript autocomplete)
// ============================================================================

export type ColorToken = typeof colors;
export type TypographyToken = typeof typography;
export type SpacingToken = typeof spacing;
export type RadiusToken = typeof radius;
export type ShadowToken = typeof shadows;
export type GradientToken = typeof gradients;
export type BreakpointToken = typeof breakpoints;
export type AnimationToken = typeof animations;
