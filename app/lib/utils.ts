/**
 * Tiny class-name helper used by shadcn-vue components.
 * Merges Tailwind classes without fighting (clsx + tailwind-merge).
 */
import type { ClassValue } from 'clsx'
import { clsx }    from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combine class names; later Tailwind utilities win on conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  // clsx handles conditionals, twMerge cleans duplicate utilities
  return twMerge(clsx(inputs))
}
