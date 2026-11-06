import { Navigate } from 'react-router'
import { ButtonLink, PageHeader } from '@/shared/ui'
import { useSession } from './session'

/**
 * The login screen.
 *
 * Sign-in is handled entirely by the backend (OAuth2 authorisation code flow,
 * secure HTTP-only session cookie). The dashboard never talks to Discord's
 * OAuth endpoints or handles tokens. Once the backend publishes how to start
 * sign-in, a link to it goes here, in place of the preview link.
 */
export function Component() {
  const session = useSession()
  if (session.status === 'signed-in') return <Navigate to="/servers" replace />

  return (
    <>
      <PageHeader
        title="Sign-in isn’t available yet"
        description="Neptune’s backend will handle signing in with Discord, and it isn’t connected to this dashboard yet."
      />
      <p className="mb-6 max-w-prose text-fg-muted">
        Until it is, you can look around the dashboard layout. Nothing you do there is saved, and no permissions are
        checked.
      </p>
      <ButtonLink to="/servers" variant="primary">
        Browse the preview
      </ButtonLink>
    </>
  )
}
