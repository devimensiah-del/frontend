/**
 * Utility Functions - Validators
 *
 * Validation functions for user input, business rules, and data integrity.
 * All validators return boolean or validation objects with error messages.
 *
 * @module lib/utils/validators
 */

/**
 * Validation result object
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

/**
 * Validate if email is a corporate email (not free providers)
 *
 * @param email - Email address to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * validateCorporateEmail('user@gmail.com') // { isValid: false, error: '...' }
 * validateCorporateEmail('user@company.com') // { isValid: true }
 * ```
 */
export function validateCorporateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: 'Email é obrigatório' };
  }

  const freeEmailProviders = [
    'gmail.com',
    'hotmail.com',
    'outlook.com',
    'yahoo.com',
    'live.com',
    'icloud.com',
    'protonmail.com',
    'aol.com',
  ];

  try {
    const domain = email.split('@')[1]?.toLowerCase();

    if (!domain) {
      return { isValid: false, error: 'Email inválido' };
    }

    if (freeEmailProviders.includes(domain)) {
      return {
        isValid: false,
        error: 'Por favor, use um email corporativo (não Gmail, Hotmail, etc.)',
      };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Email inválido' };
  }
}

/**
 * Validate if email domain matches website domain
 * Helps detect potential conflicts or data entry errors
 *
 * @param email - Email address
 * @param websiteUrl - Website URL
 * @returns Validation result with warning if mismatch
 *
 * @example
 * ```typescript
 * validateEmailDomainMatch('user@example.com', 'https://example.com')
 * // { isValid: true }
 *
 * validateEmailDomainMatch('user@other.com', 'https://example.com')
 * // { isValid: true, warning: 'Domínios diferentes...' }
 * ```
 */
export function validateEmailDomainMatch(
  email: string,
  websiteUrl: string
): ValidationResult {
  if (!email || !websiteUrl) {
    return { isValid: true };
  }

  try {
    const emailDomain = email.split('@')[1]?.toLowerCase();
    const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
    const websiteDomain = new URL(url).hostname.replace('www.', '').toLowerCase();

    if (emailDomain !== websiteDomain) {
      return {
        isValid: true,
        warning: `Email e website têm domínios diferentes (${emailDomain} vs ${websiteDomain}). Isto está correto?`,
      };
    }

    return { isValid: true };
  } catch {
    return { isValid: true };
  }
}

/**
 * Validate URL format and accessibility
 *
 * @param url - URL to validate
 * @param requireHttps - Whether to require HTTPS protocol
 * @returns Validation result
 */
export function validateUrl(url: string, requireHttps = false): ValidationResult {
  if (!url) {
    return { isValid: false, error: 'URL é obrigatória' };
  }

  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);

    if (requireHttps && parsed.protocol !== 'https:') {
      return {
        isValid: false,
        error: 'URL deve usar HTTPS para segurança',
      };
    }

    if (!parsed.hostname.includes('.')) {
      return { isValid: false, error: 'URL deve ter um domínio válido' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'URL inválida' };
  }
}

/**
 * Validate Brazilian phone number
 *
 * @param phone - Phone number (can be formatted or digits only)
 * @returns Validation result
 *
 * @example
 * ```typescript
 * validateBrazilianPhone('11987654321') // { isValid: true }
 * validateBrazilianPhone('(11) 98765-4321') // { isValid: true }
 * validateBrazilianPhone('123') // { isValid: false, error: '...' }
 * ```
 */
export function validateBrazilianPhone(phone: string): ValidationResult {
  if (!phone) {
    return { isValid: true }; // Optional field
  }

  const digits = phone.replace(/\D/g, '');

  if (digits.length !== 10 && digits.length !== 11) {
    return {
      isValid: false,
      error: 'Telefone deve ter 10 ou 11 dígitos (DDD + número)',
    };
  }

  // Validate DDD (area code)
  const ddd = parseInt(digits.slice(0, 2));
  if (ddd < 11 || ddd > 99) {
    return { isValid: false, error: 'DDD inválido' };
  }

  return { isValid: true };
}

/**
 * Validate text length and quality for challenge/description fields
 *
 * @param text - Text to validate
 * @param minLength - Minimum length
 * @param maxLength - Maximum length
 * @returns Validation result
 */
export function validateTextQuality(
  text: string,
  minLength: number,
  maxLength: number
): ValidationResult {
  if (!text) {
    return { isValid: false, error: 'Este campo é obrigatório' };
  }

  if (text.length < minLength) {
    return {
      isValid: false,
      error: `Texto muito curto. Mínimo ${minLength} caracteres (atual: ${text.length})`,
    };
  }

  if (text.length > maxLength) {
    return {
      isValid: false,
      error: `Texto muito longo. Máximo ${maxLength} caracteres (atual: ${text.length})`,
    };
  }

  // Check for generic/low-quality responses
  const genericPhrases = [
    /^(crescer|vender mais|melhorar|aumentar)$/i,
    /^.{1,20}$/i, // Very short responses
  ];

  for (const pattern of genericPhrases) {
    if (pattern.test(text.trim())) {
      return {
        isValid: false,
        error: 'Por favor, seja mais específico sobre o desafio da sua empresa',
      };
    }
  }

  return { isValid: true };
}

/**
 * Validate CNPJ format (Brazilian company tax ID)
 *
 * @param cnpj - CNPJ string (formatted or digits only)
 * @returns Validation result
 *
 * @example
 * ```typescript
 * validateCNPJ('12.345.678/0001-90') // { isValid: true }
 * validateCNPJ('12345678000190') // { isValid: true }
 * ```
 */
export function validateCNPJ(cnpj: string): ValidationResult {
  if (!cnpj) {
    return { isValid: true }; // Optional field
  }

  const digits = cnpj.replace(/\D/g, '');

  if (digits.length !== 14) {
    return { isValid: false, error: 'CNPJ deve ter 14 dígitos' };
  }

  // Check if all digits are the same (invalid)
  if (/^(\d)\1+$/.test(digits)) {
    return { isValid: false, error: 'CNPJ inválido' };
  }

  // Validate check digits
  let size = digits.length - 2;
  let numbers = digits.substring(0, size);
  const digitsCheck = digits.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digitsCheck.charAt(0))) {
    return { isValid: false, error: 'CNPJ inválido' };
  }

  size = size + 1;
  numbers = digits.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digitsCheck.charAt(1))) {
    return { isValid: false, error: 'CNPJ inválido' };
  }

  return { isValid: true };
}

/**
 * Validate social media handle (Instagram, TikTok, etc.)
 *
 * @param handle - Social media handle (with or without @)
 * @returns Validation result
 */
export function validateSocialHandle(handle: string): ValidationResult {
  if (!handle) {
    return { isValid: true }; // Optional field
  }

  const cleaned = handle.replace('@', '').trim();

  if (cleaned.length < 3) {
    return { isValid: false, error: 'Handle muito curto (mínimo 3 caracteres)' };
  }

  if (cleaned.length > 30) {
    return { isValid: false, error: 'Handle muito longo (máximo 30 caracteres)' };
  }

  // Only alphanumeric, underscores, and dots
  if (!/^[a-zA-Z0-9._]+$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Handle deve conter apenas letras, números, pontos e underscores',
    };
  }

  return { isValid: true };
}

/**
 * Normalize and validate a URL
 * Adds https:// if missing, removes trailing slashes
 *
 * @param url - URL to normalize
 * @returns Normalized URL
 *
 * @example
 * ```typescript
 * normalizeUrl('example.com') // 'https://example.com'
 * normalizeUrl('http://example.com/') // 'https://example.com'
 * ```
 */
export function normalizeUrl(url: string): string {
  if (!url) return '';

  let normalized = url.trim();

  // Add https:// if no protocol
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }

  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '');

  return normalized;
}

/**
 * Normalize phone number to digits only
 *
 * @param phone - Phone number (formatted or not)
 * @returns Digits only
 */
export function normalizePhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Normalize social media handle (remove @, trim)
 *
 * @param handle - Social media handle
 * @returns Normalized handle
 */
export function normalizeSocialHandle(handle: string): string {
  if (!handle) return '';
  return handle.replace('@', '').trim();
}
