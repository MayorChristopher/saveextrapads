// lib/utils/slugify.js

/**
 * Converts a string into a slug (URL-safe ID)
 * e.g. "Night Protection Plus" → "night-protection-plus"
 */
export function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')  // remove special characters
      .replace(/\s+/g, '-')          // spaces to hyphens
      .replace(/-+/g, '-')           // remove duplicate hyphens
      .trim();
  }
  