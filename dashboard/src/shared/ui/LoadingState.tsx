import { LoaderCircle } from 'lucide-react'

interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Loading' }: LoadingStateProps) {
  return (
    <div role="status" className="flex items-center gap-2.5 py-10 text-fg-muted">
      <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-accent" />
      <span>{label}…</span>
    </div>
  )
}
