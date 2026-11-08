import { Link, Navigate, useSearchParams } from 'react-router'
import { env } from '@/shared/config/env'
import { LoadingState, PageHeader } from '@/shared/ui'
import { SignInPanel } from './SignInPanel'
import { parseSignInOutcome } from './signInOutcome'
import { useSession } from './session'

/**
 * The login screen.
 *
 * Sign-in is handled entirely by the backend (OAuth2 authorisation code flow,
 * secure HTTP-only session cookie). The dashboard only sends the browser to the
 * address the backend provides; it never talks to Discord's OAuth endpoints,
 * and it never sees or stores tokens. See docs/sign-in.md.
 */
export function Component() {
  const session = useSession()
  const [params] = useSearchParams()

  if (session.status === 'signed-in') return <Navigate to="/servers" replace />
  if (session.status === 'loading') return <LoadingState label="Checking your session" />

  return (
    <>
      <PageHeader
        title="Welcome to Neptune"
        description="Sign in with your Discord account to manage your servers and your personal settings."
      />
      <SignInPanel startUrl={env.authStartUrl} outcome={parseSignInOutcome(params)} />
      {session.status === 'unavailable' && (
        <p className="mt-6 text-sm text-fg-muted">
          Just looking?{' '}
          <Link to="/servers" className="text-fg underline underline-offset-2 hover:text-accent-strong">
            Browse the preview
          </Link>
          . Nothing in it is saved and no permissions are checked.
        </p>
      )}
    </>
  )
}
