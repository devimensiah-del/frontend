/**
 * Data formatting utilities for consistent display across the application
 */

/**
 * Normalize a value that might be a comma-separated string into an array
 * Handles various formats from LLM responses:
 * - "item1, item2, item3" -> ["item1", "item2", "item3"]
 * - "item1., item2., item3." -> ["item1", "item2", "item3"]
 * - ["item1", "item2"] -> ["item1", "item2"] (passthrough)
 */
export function normalizeToArray(value: unknown): string[] {
  if (!value) return [];

  // Already an array - normalize each item
  if (Array.isArray(value)) {
    return value
      .map(v => String(v).trim())
      .filter(Boolean);
  }

  // String - split by common delimiters
  if (typeof value === 'string') {
    // Handle period-comma pattern (e.g., "item1., item2., item3.")
    // Also handle just commas or semicolons
    return value
      .split(/\.,\s*|,\s*|;\s*/)
      .map(item => item.trim().replace(/\.+$/, '')) // Remove trailing periods
      .filter(item => item.length > 0);
  }

  // Fallback - convert to string
  return [String(value).trim()].filter(Boolean);
}

/**
 * Format a list for display - returns either a bullet list or "—" if empty
 * Use this for rendering in React components
 */
export function formatListItems(value: unknown): string[] {
  const items = normalizeToArray(value);
  return items;
}

/**
 * Check if a value represents an empty/null state
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

/**
 * Format currency in Brazilian Real (BRL)
 */
export function formatCurrency(value: number | string | undefined | null): string {
  if (value === null || value === undefined || value === '') return '—';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return '—';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
}

/**
 * Format a date string to Brazilian locale
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '—';

  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

/**
 * Format a date with time to Brazilian locale
 */
export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return '—';

  try {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

/**
 * Format percentage
 */
export function formatPercentage(value: number | undefined | null): string {
  if (value === null || value === undefined) return '—';
  return `${value}%`;
}
