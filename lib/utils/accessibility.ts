/**
 * Accessibility Utilities
 * WCAG 2.1 AA compliance helpers
 */

let idCounter = 0;

/**
 * Generate unique IDs for aria-describedby and aria-labelledby
 */
export function createId(prefix = 'a11y'): string {
  idCounter++;
  return `${prefix}-${idCounter}-${Date.now()}`;
}

/**
 * Announce message to screen readers using aria-live region
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Focus trap for modals and dialogs
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        lastFocusable?.focus();
        e.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        firstFocusable?.focus();
        e.preventDefault();
      }
    }
  }

  element.addEventListener('keydown', handleTabKey);

  // Focus first element
  firstFocusable?.focus();

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Check if color contrast meets WCAG AA standard (4.5:1 for normal text)
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  const minContrast = level === 'AAA' ? 7 : 4.5;
  const contrast = getContrastRatio(foreground, background);
  return contrast >= minContrast;
}

/**
 * Calculate color contrast ratio
 */
function getContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance of a color
 */
function getRelativeLuminance(color: string): number {
  // Simple implementation - would need full RGB parsing in production
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const sRGB = val / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Get visually hidden class (SR-only content)
 */
export const srOnlyClass =
  'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 [clip:rect(0,0,0,0)]';

/**
 * Manage focus visible for keyboard navigation
 */
export function setupFocusVisible(): void {
  let hadKeyboardEvent = true;
  let hadFocusVisibleRecently = false;

  function onKeyDown() {
    hadKeyboardEvent = true;
  }

  function onPointerDown() {
    hadKeyboardEvent = false;
  }

  function onFocus(e: FocusEvent) {
    if (hadKeyboardEvent) {
      (e.target as HTMLElement).setAttribute('data-focus-visible', 'true');
    }
    hadFocusVisibleRecently = true;
    hadKeyboardEvent = false;
  }

  function onBlur(e: FocusEvent) {
    if ((e.target as HTMLElement).hasAttribute('data-focus-visible')) {
      hadFocusVisibleRecently = true;
      (e.target as HTMLElement).removeAttribute('data-focus-visible');
    }
  }

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('mousedown', onPointerDown, true);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('touchstart', onPointerDown, true);
  document.addEventListener('focus', onFocus, true);
  document.addEventListener('blur', onBlur, true);
}
