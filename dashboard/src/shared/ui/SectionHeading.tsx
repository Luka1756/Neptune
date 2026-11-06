import type { ReactNode } from 'react'

interface SectionHeadingProps {
  children: ReactNode
  description?: string
  id?: string
}

/** A heading for a group of content within a page. Sits under the page's h1. */
export function SectionHeading({ children, description, id }: SectionHeadingProps) {
  return (
    <div className="mb-3">
      <h2 id={id} className="text-sm font-semibold text-fg">
        {children}
      </h2>
      {description && <p className="mt-0.5 max-w-prose text-sm text-fg-muted">{description}</p>}
    </div>
  )
}
