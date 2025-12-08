import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalize a value that might be a comma-separated string into an array
 * Handles various formats from LLM responses
 */
export function normalizeToArray(value: unknown): string[] {
  if (!value) return []

  // Already an array - normalize each item
  if (Array.isArray(value)) {
    return value
      .map(v => String(v).trim())
      .filter(Boolean)
  }

  // String - split by common delimiters
  if (typeof value === 'string') {
    return value
      .split(/\.,\s*|,\s*|;\s*/)
      .map(item => item.trim().replace(/\.+$/, ''))
      .filter(item => item.length > 0)
  }

  // Fallback
  return [String(value).trim()].filter(Boolean)
}
