import type { ReactNode } from 'react'
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

/** The page's single h1. Also sets the browser tab title. */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  useDocumentTitle(title)

  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-fg">{title}</h1>
        {description && <p className="mt-1 max-w-prose text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  )
}
