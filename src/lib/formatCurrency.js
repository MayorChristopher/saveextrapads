// src/lib/formatCurrency.js

/**
 * Formats a number as a localized currency string.
 * 
 * @param {number} value - The numeric value to format.
 * @param {string} [locale='en-NG'] - The locale string, defaults to Nigerian English.
 * @param {string} [currency='NGN'] - The currency code, defaults to Nigerian Naira.
 * @returns {string} - Formatted currency string.
 */
export const formatCurrency = (value, locale = 'en-NG', currency = 'NGN') => {
  if (typeof value !== 'number') return '';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
