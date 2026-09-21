import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

/** Combines conditional class names and resolves Tailwind conflicts, e.g. cn('px-4 py-2', isActive && 'bg-gold', className). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
