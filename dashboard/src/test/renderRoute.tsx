import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { createQueryClient } from '@/app/queryClient'
import { routes } from '@/app/router'
import { SessionContext, type SessionState } from '@/features/auth/session'

/** A well-formed Discord server ID for tests. It does not refer to a real server. */
export const GUILD_ID = '123456789012345678'

/**
 * Renders the real route table at `path` in an in-memory router.
 *
 * `session` lets a test stand in for the session states the backend will
 * eventually provide. This is test-only: the shipped app has no way to set
 * the session, and `unavailable` is the only state it can be in today.
 */
export function renderRoute(path: string, session?: SessionState) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const tree = (
    <QueryClientProvider client={createQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )

  const view = render(session ? <SessionContext.Provider value={session}>{tree}</SessionContext.Provider> : tree)
  return { router, ...view }
}
