/**
 * What happened the last time someone tried to sign in, as reported back to
 * the login page.
 *
 * ASSUMPTION TO CONFIRM WITH THE BACKEND: how the backend tells the dashboard
 * that sign-in failed is not defined yet. This reads an `error` query
 * parameter on `/login`, using the standard OAuth 2.0 error codes
 * (RFC 6749, section 4.1.2.1). In particular `access_denied` means the person
 * declined on Discord. If the backend reports failures differently, this is
 * the one place to change. See docs/sign-in.md.
 *
 * The value is only ever mapped to one of two fixed outcomes. It is never
 * shown on the page, so a crafted link can't put text or technical details in
 * front of someone.
 */
export type SignInOutcome = 'declined' | 'failed'

export function parseSignInOutcome(params: URLSearchParams): SignInOutcome | null {
  const error = params.get('error')?.trim()
  if (!error) return null
  return error === 'access_denied' ? 'declined' : 'failed'
}
