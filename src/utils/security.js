/**
 * Security & Sanitization Utilities for DS Roulette
 * Protects against XSS, Prototype Pollution, Tampered LocalStorage, and Malicious URLs.
 */

// Safe domains allowed for avatars and external assets
const TRUSTED_AVATAR_HOSTS = [
  'lh3.googleusercontent.com',
  'api.dicebear.com',
  'avatars.githubusercontent.com',
  'images.unsplash.com'
];

/**
 * Validates and sanitizes an avatar image URL.
 * Strictly prevents javascript: URLs, data URIs with scripts, and rogue hosts.
 */
export function getSafeAvatarUrl(url, fallbackSeed = 'DS') {
  if (!url || typeof url !== 'string') {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fallbackSeed)}`;
  }

  try {
    const parsed = new URL(url);
    // Must be HTTPS
    if (parsed.protocol !== 'https:') {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fallbackSeed)}`;
    }

    // Must be a trusted host or clean https URL
    const hostname = parsed.hostname.toLowerCase();
    const isTrusted = TRUSTED_AVATAR_HOSTS.some(
      (trusted) => hostname === trusted || hostname.endsWith(`.${trusted}`)
    );

    if (!isTrusted && !hostname.endsWith('.googleusercontent.com')) {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fallbackSeed)}`;
    }

    return parsed.href;
  } catch {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fallbackSeed)}`;
  }
}

/**
 * Sanitizes user-generated or external text strings.
 * Truncates excessive length and strips control characters.
 */
export function sanitizeText(str, maxLength = 100) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // remove control chars
    .trim()
    .slice(0, maxLength);
}

/**
 * Prototype-pollution proof JSON parser.
 * Strips __proto__, constructor, and prototype keys from parsed objects.
 */
export function safeJsonParse(jsonString, fallback = null) {
  if (!jsonString || typeof jsonString !== 'string') return fallback;

  try {
    return JSON.parse(jsonString, (key, value) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return undefined; // Drop polluted keys
      }
      return value;
    });
  } catch {
    return fallback;
  }
}

/**
 * Validates user stats schema loaded from client storage.
 * Ensures numbers are within safe bounds and dates are valid.
 */
export function validateStatsSchema(stats) {
  const defaultStats = {
    streak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    quizzesAttempted: 0,
    quizzesCorrect: 0,
    totalSpins: 0
  };

  if (!stats || typeof stats !== 'object') return defaultStats;

  return {
    streak: Math.min(Math.max(1, Number(stats.streak) || 1), 3650),
    lastActiveDate: typeof stats.lastActiveDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(stats.lastActiveDate)
      ? stats.lastActiveDate
      : defaultStats.lastActiveDate,
    quizzesAttempted: Math.max(0, Number(stats.quizzesAttempted) || 0),
    quizzesCorrect: Math.max(0, Number(stats.quizzesCorrect) || 0),
    totalSpins: Math.max(0, Number(stats.totalSpins) || 0)
  };
}

/**
 * Safe local storage wrapper with error boundaries and quota handling.
 */
export const secureStorage = {
  getItem: (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return safeJsonParse(raw, fallback);
    } catch {
      return fallback;
    }
  },

  setItem: (key, value) => {
    try {
      // Prevent storing gigantic objects (quota defense)
      const serialized = JSON.stringify(value);
      if (serialized.length > 500000) { // 500 KB limit
        console.warn(`[Security] Refusing to persist oversized payload for key: ${key}`);
        return false;
      }
      localStorage.setItem(key, serialized);
      return true;
    } catch (e) {
      console.warn(`[Security] Storage write failed:`, e);
      return false;
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (_) {}
  }
};
