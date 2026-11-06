import { cn } from '@/shared/lib/cn'

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-semibold tracking-tight text-fg', className)}>
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 text-accent">
        <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      Neptune
    </span>
  )
}
