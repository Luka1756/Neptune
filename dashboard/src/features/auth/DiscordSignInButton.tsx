import { LoaderCircle, LogIn } from 'lucide-react'
import { type MouseEvent, useEffect, useState } from 'react'
import { buttonClasses } from '@/shared/ui'
import { discordMarkUrl } from './signInIcon'

interface DiscordSignInButtonProps {
  /**
   * Where the backend begins Discord sign-in, or null when it isn't configured.
   * The dashboard never builds this address or talks to Discord itself.
   */
  startUrl: string | null
  /** Id of the element that explains the button, so assistive technology reads it with the button. */
  describedBy?: string
}

/**
 * True for an ordinary left click, which navigates this page. Ctrl, Cmd, Shift and Alt clicks open a new
 * tab or window or start a download, and this page stays where it is.
 */
function navigatesThisPage(event: MouseEvent): boolean {
  return event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey
}

/**
 * "Continue with Discord".
 *
 * Configured: a plain link, so the browser makes a full-page navigation to the
 * backend (step 2 of the intended flow). Not configured: it stays visible but
 * does nothing, and says why. It never starts a fake sign-in.
 */
export function DiscordSignInButton({ startUrl, describedBy }: DiscordSignInButtonProps) {
  const [redirecting, setRedirecting] = useState(false)

  // Coming back with the browser's back button can restore this page from the
  // back/forward cache with the button still in its "redirecting" state.
  useEffect(() => {
    const reset = () => setRedirecting(false)
    window.addEventListener('pageshow', reset)
    return () => window.removeEventListener('pageshow', reset)
  }, [])

  const icon = redirecting ? (
    <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
  ) : discordMarkUrl ? (
    <img src={discordMarkUrl} alt="" className="size-5 shrink-0 object-contain" />
  ) : (
    <LogIn aria-hidden="true" className="size-5" />
  )

  if (!startUrl) {
    return (
      <button
        type="button"
        aria-disabled="true"
        aria-describedby={describedBy}
        onClick={(event) => event.preventDefault()}
        className={buttonClasses('primary', 'w-full cursor-not-allowed opacity-50 hover:bg-accent')}
      >
        {icon}
        Continue with Discord
      </button>
    )
  }

  return (
    <a
      href={startUrl}
      aria-describedby={describedBy}
      aria-busy={redirecting || undefined}
      onClick={(event) => {
        if (navigatesThisPage(event)) setRedirecting(true)
      }}
      className={buttonClasses('primary', 'w-full')}
    >
      {icon}
      {redirecting ? 'Redirecting to Discord…' : 'Continue with Discord'}
    </a>
  )
}
