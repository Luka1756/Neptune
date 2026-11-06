import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

interface ErrorStateProps {
  title: string
  /** Say what happened and what the person can do next. */
  children?: ReactNode
  action?: ReactNode
  /** Announce immediately to screen readers. Use for failures, not for "not found". */
  live?: boolean
}

export function ErrorState({ title, children, action, live = false }: ErrorStateProps) {
  return (
    <section role={live ? 'alert' : undefined} className="flex gap-3 py-6">
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warn" />
      <div className="min-w-0">
        <h1 className="text-base font-semibold text-fg">{title}</h1>
        {children && <div className="mt-1 max-w-prose text-fg-muted">{children}</div>}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </section>
  )
}
