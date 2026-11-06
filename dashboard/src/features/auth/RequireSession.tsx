import { Navigate, Outlet, useLocation } from 'react-router'
import { LoadingState } from '@/shared/ui'
import { useSession } from './session'

/**
 * Route guard for pages that need a signed-in person.
 *
 * This only decides what to show. It does NOT protect any data: the backend
 * must check the session and the person's server permissions on every
 * request, because anything in the browser can be bypassed.
 *
 * While the backend is not connected (`unavailable`), pages are shown as a
 * layout preview, with a notice in the shell saying so. We never pretend
 * someone is signed in.
 */
export function RequireSession() {
  const session = useSession()
  const location = useLocation()

  switch (session.status) {
    case 'loading':
      return <LoadingState label="Checking your session" />
    case 'signed-out':
      return <Navigate to="/login" replace state={{ from: location.pathname }} />
    case 'unavailable':
    case 'signed-in':
      return <Outlet />
  }
}
