import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Enterprise CSS Class Merging Utility.
 * Combines multiple Tailwind CSS class inputs into a single string, 
 * resolving conflicts using 'twMerge' and conditional logic from 'clsx'.
 * 
 * @param inputs - A flexible collection of class strings, objects, or arrays.
 * @returns A consolidated and optimized CSS class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

