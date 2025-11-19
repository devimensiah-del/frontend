export { cn } from './cn'

/**
 * Format currency in Brazilian Real (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Format date to Brazilian format (dd/mm/yyyy)
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR').format(d)
}

/**
 * Format date with time to Brazilian format
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d)
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Get status color classes
 */
export function getStatusColor(status: string): string {
  const colors = {
    pending: 'bg-status-pending text-white',
    analyzing: 'bg-status-analyzing text-white',
    complete: 'bg-status-complete text-white',
    failed: 'bg-status-failed text-white',
  }
  return colors[status as keyof typeof colors] || 'bg-gray-500 text-white'
}

/**
 * Get status label in Portuguese
 */
export function getStatusLabel(status: string): string {
  const labels = {
    pending: 'Pendente',
    analyzing: 'Analisando',
    complete: 'Completo',
    failed: 'Falhou',
  }
  return labels[status as keyof typeof labels] || status
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
