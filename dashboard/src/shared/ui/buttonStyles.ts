import { cn } from '@/shared/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-fg hover:bg-accent-strong',
  secondary: 'border border-control bg-raised text-fg hover:bg-line',
  ghost: 'text-fg-muted hover:bg-raised hover:text-fg',
}

/** Class names for anything that should look like a button (a real button or a link). */
export function buttonClasses(variant: ButtonVariant = 'secondary', className?: string): string {
  return cn(base, variants[variant], className)
}
