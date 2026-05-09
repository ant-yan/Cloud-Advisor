import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatScore(score) {
  return Math.round(score);
}

export function getScoreColor(score) {
  if (score >= 75) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 50) return 'text-amber-600 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
}

export function getScoreBg(score) {
  if (score >= 75) return 'bg-emerald-50 dark:bg-emerald-900/20';
  if (score >= 50) return 'bg-amber-50 dark:bg-amber-900/20';
  return 'bg-rose-50 dark:bg-rose-900/20';
}

// URL-safe base64 so the share param doesn't need double-encoding
export function encodeResults(answers, results) {
  const data = { answers, results };
  return btoa(encodeURIComponent(JSON.stringify(data)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function decodeResults(encoded) {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    return JSON.parse(decodeURIComponent(atob(padded)));
  } catch {
    return null;
  }
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : (plural || singular + 's');
}
