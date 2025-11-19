/**
 * IMENSIAH Component Styles
 * Pre-built className utilities for consistent component styling
 *
 * RULE: Use these instead of hardcoding Tailwind classes
 * RULE: All styles use design tokens
 */

import { colors, typography, spacing, radius, shadows } from './tokens';

// ============================================================================
// BUTTON STYLES
// ============================================================================

export const buttonStyles = {
  // Primary button (Gold with auto-contrast text)
  primary: 'bg-accent text-accent-foreground hover:bg-accent/90 font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,193,7,0.3)] hover:scale-105',

  // Secondary button (Ocean blue with auto-contrast text)
  secondary: 'bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-300',

  // Outline button
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all duration-300',

  // Ghost button
  ghost: 'text-foreground hover:bg-muted font-medium transition-all duration-300',

  // Sizes
  size: {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-10 py-6 text-lg rounded-xl',
    xl: 'px-14 py-8 text-xl rounded-2xl',
  },
} as const;

// ============================================================================
// CARD STYLES
// ============================================================================

export const cardStyles = {
  // White card with subtle shadow
  base: 'bg-card text-card-foreground rounded-xl shadow-medium p-8',

  // Card with hover effect
  hover: 'bg-card text-card-foreground rounded-xl shadow-medium p-8 hover:shadow-strong transition-shadow duration-300',

  // Card with hover lift
  hoverLift: 'bg-card text-card-foreground rounded-xl shadow-medium p-8 hover:shadow-strong hover:-translate-y-1 transition-all duration-300',

  // Gradient card
  gradient: 'bg-gradient-to-br from-primary/5 to-accent/5 text-foreground rounded-xl p-8',

  // Glass card
  glass: 'bg-card/70 backdrop-blur-xl rounded-xl border border-border/30 p-8 text-card-foreground',
} as const;

// ============================================================================
// SECTION STYLES
// ============================================================================

export const sectionStyles = {
  // Standard section padding
  base: 'py-20',

  // With background
  withBg: 'py-20 bg-gradient-to-br from-primary/5 to-accent/5',

  // White background
  white: 'py-20 bg-background',

  // Container
  container: 'container mx-auto px-4 md:px-8 lg:px-12',
} as const;

// ============================================================================
// TEXT STYLES
// ============================================================================

export const textStyles = {
  // Headings
  h1: 'text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight',
  h2: 'text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight',
  h3: 'text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight',
  h4: 'text-xl md:text-2xl font-bold text-foreground',

  // Body text
  body: 'text-base md:text-lg text-foreground leading-relaxed',
  bodyLarge: 'text-lg md:text-xl text-foreground leading-relaxed',

  // Muted text
  muted: 'text-sm md:text-base text-muted-foreground',

  // Accent text (gold)
  accent: 'text-accent font-semibold',

  // Gradient text
  gradient: 'bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent',
} as const;

// ============================================================================
// ICON STYLES
// ============================================================================

export const iconStyles = {
  // Icon sizes
  size: {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
  },

  // Icon colors (semantic use only)
  primary: 'text-primary',
  accent: 'text-accent',
  muted: 'text-muted-foreground',
  success: 'text-green-600',
  warning: 'text-orange-600',
  error: 'text-red-600',
} as const;

// ============================================================================
// BADGE STYLES
// ============================================================================

export const badgeStyles = {
  // Status badges
  success: 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold',
  warning: 'bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold',
  error: 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold',
  info: 'bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold',

  // Accent badge (gold)
  accent: 'bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold',

  // Primary badge (ocean blue)
  primary: 'bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold',
} as const;

// ============================================================================
// FORM STYLES
// ============================================================================

export const formStyles = {
  // Input field
  input: 'w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 bg-background text-foreground',

  // Textarea
  textarea: 'w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 min-h-[120px] bg-background text-foreground',

  // Label
  label: 'block text-sm font-semibold text-foreground mb-2',

  // Error message
  error: 'text-red-600 text-sm mt-1',

  // Helper text
  helper: 'text-muted-foreground text-sm mt-1',
} as const;

// ============================================================================
// GRADIENT UTILITIES
// ============================================================================

export const gradientStyles = {
  hero: 'bg-gradient-to-br from-primary via-primary/95 to-accent',
  imensiah: 'bg-gradient-to-br from-primary via-primary/80 to-accent',
  subtle: 'bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10',
} as const;

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

export const animationStyles = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  scaleUp: 'hover:scale-105 transition-transform duration-300',
  glow: 'shadow-[0_0_20px_rgba(255,193,7,0.3)]',
} as const;

// ============================================================================
// HELPER FUNCTION
// ============================================================================

/**
 * Combine multiple style strings
 * @example cn(buttonStyles.primary, buttonStyles.size.lg)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
