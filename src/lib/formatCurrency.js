// src/lib/formatCurrency.js

/**
 * Formats a numeric value as currency based on locale and currency code.
 *
 * @param {number} value - The numeric amount to format.
 * @param {string} currency - Currency code (e.g., 'USD', 'NGN').
 * @returns {string} - Formatted currency string.
 */
export const formatCurrency = (value, currency = 'NGN') => {
  if (typeof value !== 'number' || isNaN(value)) return '';

  const locale = currency === 'USD' ? 'en-US' : 'en-NG';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
