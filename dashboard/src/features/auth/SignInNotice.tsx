import { TriangleAlert } from 'lucide-react'
import type { SignInOutcome } from './signInOutcome'

/**
 * Fixed wording for each outcome. Nothing from the URL or the backend is ever
 * displayed, so no technical or sensitive details can reach the page.
 */
const messages: Record<SignInOutcome, { title: string; body: string }> = {
  declined: {
    title: 'Access wasn’t granted',
    body: 'Neptune needs your permission on Discord to show your servers. You can try again whenever you’re ready.',
  },
  failed: {
    title: 'We couldn’t sign you in',
    body: 'Something went wrong while signing in with Discord. Try again in a moment.',
  },
}

export function SignInNotice({ outcome }: { outcome: SignInOutcome }) {
  const { title, body } = messages[outcome]
  return (
    <div role="alert" className="mb-4 flex gap-3 rounded-md border border-line bg-raised p-3">
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-warn" />
      <div className="min-w-0">
        <p className="font-medium text-fg">{title}</p>
        <p className="mt-0.5 text-sm text-fg-muted">{body}</p>
      </div>
    </div>
  )
}
