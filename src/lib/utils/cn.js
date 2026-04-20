import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names using clsx and resolves Tailwind conflicts with twMerge.
 * @param  {...any} inputs - Class name values (strings, arrays, objects)
 * @returns {string} Merged class name string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
