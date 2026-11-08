import { useId } from 'react'
import { DiscordSignInButton } from './DiscordSignInButton'
import { SignInNotice } from './SignInNotice'
import type { SignInOutcome } from './signInOutcome'

interface SignInPanelProps {
  startUrl: string | null
  outcome: SignInOutcome | null
}

export function SignInPanel({ startUrl, outcome }: SignInPanelProps) {
  const noteId = useId()
  const available = startUrl !== null

  return (
    <div className="rounded-lg border border-line bg-panel p-5 sm:p-6">
      {outcome && <SignInNotice outcome={outcome} />}
      <DiscordSignInButton startUrl={startUrl} describedBy={noteId} />
      <p id={noteId} className="mt-3 text-sm text-fg-faint">
        {available
          ? 'You’ll sign in on Discord. Neptune never sees your Discord password.'
          : 'Sign-in isn’t available yet. It will open Discord once Neptune’s backend is connected.'}
      </p>
    </div>
  )
}
