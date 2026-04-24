import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function to merge Tailwind CSS classes using clsx and tailwind-merge.
 * It handles conditional classes and ensures that Tailwind classes are merged correctly (avoiding conflicts).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
