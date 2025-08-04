import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for combining and merging CSS class names.
 * 
 * This function combines the power of clsx for conditional classes
 * and tailwind-merge for handling Tailwind CSS class conflicts.
 * It's commonly used throughout the application for dynamic styling.
 * 
 * @param inputs - Variable number of class value inputs (strings, objects, arrays)
 * @returns Merged and deduplicated class string
 * 
 * @example
 * ```tsx
 * // Basic usage
 * cn('bg-red-500', 'text-white') // 'bg-red-500 text-white'
 * 
 * // Conditional classes
 * cn('base-class', { 'active-class': isActive, 'disabled-class': isDisabled })
 * 
 * // Tailwind conflict resolution
 * cn('bg-red-500', 'bg-blue-500') // 'bg-blue-500' (last one wins)
 * 
 * // Array inputs
 * cn(['class1', 'class2'], 'class3') // 'class1 class2 class3'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Utility function to safely get environment variables with fallbacks.
 * 
 * @param key - Environment variable key
 * @param fallback - Optional fallback value if env var is not set
 * @returns Environment variable value or fallback
 * @throws Error if no fallback provided and env var is missing
 */
export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];
  
  if (!value) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Environment variable ${key} is not set`);
  }
  
  return value;
}

/**
 * Utility function to format time estimates in a readable format.
 * 
 * @param minutes - Number of minutes
 * @returns Formatted time string (e.g., "5 minutes", "1 hour", "1 hour 30 minutes")
 */
export function formatTimeEstimate(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  let result = `${hours} hour${hours === 1 ? '' : 's'}`;
  
  if (remainingMinutes > 0) {
    result += ` ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}`;
  }
  
  return result;
}

/**
 * Utility function to capitalize the first letter of a string.
 * 
 * @param str - String to capitalize
 * @returns String with first letter capitalized
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Utility function to truncate text with ellipsis.
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Utility function to format numbers with commas for better readability.
 * 
 * @param num - Number to format
 * @returns Formatted number string with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Utility function to safely parse JSON with error handling.
 * 
 * @param jsonString - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback value
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
}
