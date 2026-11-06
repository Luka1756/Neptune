/** Joins class names, skipping anything falsy. Keeps conditional classes readable. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
