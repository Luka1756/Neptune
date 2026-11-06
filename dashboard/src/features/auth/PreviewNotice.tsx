import { useSession } from './session'

/** Shown on every page while sign-in isn't connected, so the preview is never mistaken for the real thing. */
export function PreviewNotice() {
  const session = useSession()
  if (session.status !== 'unavailable') return null

  return (
    <div role="note" className="mb-6 border-l-2 border-warn bg-panel py-2.5 pr-3 pl-3.5 text-sm text-fg-muted">
      <span className="font-medium text-fg">Preview.</span> Sign-in isn’t connected yet, so this page can’t check who
      you are or which servers you can manage.
    </div>
  )
}
