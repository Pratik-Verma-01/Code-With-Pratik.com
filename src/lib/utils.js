import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes safely
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a URL-friendly slug
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with -
    .replace(/^-+|-+$/g, ''); // Trim -
}

/**
 * Formats a Firestore Timestamp or Date to readable string
 */
export function formatDate(date) {
  if (!date) return '';
  // Handle Firestore Timestamp (has .toDate())
  const d = date.toDate ? date.toDate() : new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(d);
}

/**
 * Truncate text for cards
 */
export function truncate(str, length = 100) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
