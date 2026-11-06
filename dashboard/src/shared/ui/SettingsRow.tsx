import { useId, type ReactNode } from 'react'

interface SettingsRowProps {
  label: string
  description?: string
  /** Receives the id to put on the control, so the label and description are announced with it. */
  children: (ids: { controlId: string; descriptionId: string | undefined }) => ReactNode
}

/**
 * One setting: a label and description on the left, the control on the right
 * (stacked on narrow screens). Rows sit on a shared divider, not in cards.
 *
 * Usage:
 *   <SettingsRow label="Private replies" description="Only you can see replies.">
 *     {({ controlId, descriptionId }) => (
 *       <Switch id={controlId} aria-describedby={descriptionId} />
 *     )}
 *   </SettingsRow>
 */
export function SettingsRow({ label, description, children }: SettingsRowProps) {
  const controlId = useId()
  const descriptionId = useId()

  return (
    <div className="flex flex-col gap-3 border-b border-line py-4 first:border-t sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 sm:max-w-md">
        <label htmlFor={controlId} className="block text-sm font-medium text-fg">
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="mt-0.5 text-sm text-fg-muted">
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0">
        {children({ controlId, descriptionId: description ? descriptionId : undefined })}
      </div>
    </div>
  )
}
