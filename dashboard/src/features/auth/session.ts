import { createContext, useContext } from 'react'

/**
 * The dashboard's view of "who is signed in".
 *
 * The backend is not connected yet, so the only state the running app can be
 * in today is `unavailable`. The other states describe what the backend will
 * eventually be able to tell us; they carry no user data because the shape of
 * that data belongs to the backend's API contract and has not been defined.
 *
 * IMPORTANT: this state exists for user experience (what to show, where to
 * redirect). It is not security. The backend must verify the session and the
 * person's permissions on every protected request.
 */
export type SessionState =
  | { status: 'unavailable' } // The backend is not connected. This is the current state.
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'signed-in' }

export const SessionContext = createContext<SessionState>({ status: 'unavailable' })

export function useSession(): SessionState {
  return useContext(SessionContext)
}
