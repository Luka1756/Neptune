import { useId, type ReactNode } from 'react'

interface ComingSoonProps {
  title: string
  children: ReactNode
  /** What has to exist before this can work. Only list things that are actually true. */
  needs?: readonly string[]
}

/**
 * The state for anything that isn't built yet. It deliberately contains no
 * controls: nothing here should look like it could be used.
 */
export function ComingSoon({ title, children, needs }: ComingSoonProps) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className="rounded-lg border border-line bg-panel p-5 sm:p-6">
      <p className="inline-flex rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
        Coming soon
      </p>
      <h2 id={headingId} className="mt-3 text-base font-semibold text-fg">
        {title}
      </h2>
      <div className="mt-1 max-w-prose text-fg-muted">{children}</div>
      {needs && needs.length > 0 && (
        <div className="mt-4 border-t border-line pt-4">
          <h3 className="text-sm font-medium text-fg">Needs</h3>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-sm text-fg-muted marker:text-fg-faint">
            {needs.map((need) => (
              <li key={need}>{need}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
