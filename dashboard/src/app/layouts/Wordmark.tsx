import { cn } from '@/shared/lib/cn'

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-semibold tracking-tight text-fg', className)}>
      <span aria-hidden="true" className="relative size-5 shrink-0 overflow-hidden rounded-full">
        <img
          src="/Neptune-pfp.png"
          alt=""
          className="absolute left-1/2 top-1/2 size-[42px] max-w-none -translate-x-1/2 -translate-y-1/2"
        />
      </span>
      Neptune
    </span>
  )
}
