import { useId, type ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

interface TextFieldProps extends Omit<ComponentProps<'input'>, 'id'> {
  label: string
  hint?: string
  /** Validation message. Shown below the field and announced to screen readers. */
  error?: string
}

/** A labelled text input. Works with react-hook-form's `register()`. */
export function TextField({ label, hint, error, className, ...props }: TextFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-fg-muted">
          {hint}
        </p>
      )}
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'min-h-11 w-full rounded-md border bg-canvas px-3 text-sm text-fg placeholder:text-fg-faint',
          error ? 'border-danger' : 'border-control',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
