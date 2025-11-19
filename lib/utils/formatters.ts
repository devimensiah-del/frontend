/**
 * Utility Functions - Formatters
 *
 * Formatting functions for dates, currency, status, and other display values.
 * All functions are pure and handle edge cases gracefully.
 *
 * @module lib/utils/formatters
 */

import type { SubmissionStatus, AIStatus, ReviewStatus } from '@/types';

/**
 * Format a date string to Brazilian Portuguese locale
 *
 * @param dateString - ISO date string or Date object
 * @param includeTime - Whether to include time in the output
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * formatDate('2024-01-15T10:30:00Z') // '15 de jan de 2024'
 * formatDate('2024-01-15T10:30:00Z', true) // '15 de jan de 2024 às 10:30'
 * ```
 */
export function formatDate(dateString: string | Date, includeTime = false): string {
  if (!dateString) return 'Data não disponível';

  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    return new Intl.DateTimeFormat('pt-BR', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Data inválida';
  }
}

/**
 * Format a number as Brazilian currency (BRL)
 *
 * @param amount - Amount in cents or reais
 * @param inCents - Whether the amount is in cents (default: false)
 * @returns Formatted currency string
 *
 * @example
 * ```typescript
 * formatCurrency(890) // 'R$ 890,00'
 * formatCurrency(89000, true) // 'R$ 890,00'
 * ```
 */
export function formatCurrency(amount: number, inCents = false): string {
  const value = inCents ? amount / 100 : amount;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Format submission status to user-friendly Portuguese text
 *
 * @param status - Submission status enum value
 * @returns User-friendly status text
 */
export function formatSubmissionStatus(status: SubmissionStatus): string {
  const statusMap: Record<SubmissionStatus, string> = {
    pending_payment: 'Aguardando Pagamento',
    paid: 'Pago',
    queued: 'Na Fila',
    collecting_data: 'Coletando Dados',
    analyzing: 'Analisando',
    in_review: 'Em Revisão',
    approved: 'Aprovado',
    failed: 'Falhou',
  };

  return statusMap[status] || status;
}

/**
 * Format AI status to user-friendly Portuguese text
 *
 * @param status - AI pipeline status
 * @returns User-friendly AI status text
 */
export function formatAIStatus(status: AIStatus): string {
  const statusMap: Record<AIStatus, string> = {
    queued: 'Na Fila',
    collecting_data: 'Coletando Dados',
    analyzing: 'Analisando com IA',
    validation: 'Validando Dados',
    complete: 'Análise Completa',
    failed: 'Falhou',
  };

  return statusMap[status] || status;
}

/**
 * Format review status to user-friendly Portuguese text
 *
 * @param status - Review workflow status
 * @returns User-friendly review status text
 */
export function formatReviewStatus(status: ReviewStatus): string {
  const statusMap: Record<ReviewStatus, string> = {
    analysis_complete: 'Análise Completa',
    in_review: 'Em Revisão Manual',
    approved: 'Aprovado',
    delivered: 'Entregue',
    archived: 'Arquivado',
  };

  return statusMap[status] || status;
}

/**
 * Format a confidence score (0-1) to percentage with label
 *
 * @param confidence - Confidence score between 0 and 1
 * @param includeLabel - Whether to include quality label
 * @returns Formatted confidence string
 *
 * @example
 * ```typescript
 * formatConfidence(0.85) // '85%'
 * formatConfidence(0.85, true) // '85% (Alta)'
 * ```
 */
export function formatConfidence(confidence: number, includeLabel = false): string {
  const percentage = Math.round(confidence * 100);

  if (!includeLabel) {
    return `${percentage}%`;
  }

  let label = 'Baixa';
  if (confidence >= 0.8) label = 'Alta';
  else if (confidence >= 0.6) label = 'Média';

  return `${percentage}% (${label})`;
}

/**
 * Format a phone number to Brazilian format
 *
 * @param phone - Phone number (digits only or formatted)
 * @returns Formatted phone number
 *
 * @example
 * ```typescript
 * formatPhone('11987654321') // '(11) 98765-4321'
 * formatPhone('1133334444') // '(11) 3333-4444'
 * ```
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';

  // Remove all non-numeric characters
  const digits = phone.replace(/\D/g, '');

  // Mobile: (11) 98765-4321
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  // Landline: (11) 3333-4444
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return phone;
}

/**
 * Format a URL to display format (remove protocol, www, trailing slash)
 *
 * @param url - Full URL
 * @returns Display-friendly URL
 *
 * @example
 * ```typescript
 * formatUrlForDisplay('https://www.example.com/') // 'example.com'
 * ```
 */
export function formatUrlForDisplay(url: string): string {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    return parsed.hostname.replace('www.', '');
  } catch {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
  }
}

/**
 * Format file size in bytes to human-readable format
 *
 * @param bytes - File size in bytes
 * @returns Formatted file size
 *
 * @example
 * ```typescript
 * formatFileSize(1024) // '1 KB'
 * formatFileSize(1048576) // '1 MB'
 * ```
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Truncate text to a maximum length with ellipsis
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 *
 * @example
 * ```typescript
 * truncateText('This is a long text', 10) // 'This is a...'
 * ```
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 *
 * @param dateString - ISO date string or Date object
 * @returns Relative time string in Portuguese
 *
 * @example
 * ```typescript
 * formatRelativeTime('2024-01-15T10:00:00Z') // '2 horas atrás'
 * ```
 */
export function formatRelativeTime(dateString: string | Date): string {
  if (!dateString) return '';

  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'agora';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'} atrás`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hora' : 'horas'} atrás`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'dia' : 'dias'} atrás`;

    return formatDate(date);
  } catch {
    return '';
  }
}
