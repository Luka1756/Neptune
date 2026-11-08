import { describe, expect, it } from 'vitest'

/**
 * A guard, not a proof: the dashboard must not store credentials, fake a
 * session, or talk to Discord's OAuth endpoints. Sign-in belongs to the backend.
 * If one of these checks fails for a legitimate reason, change the design, not the check.
 */
const raw = import.meta.glob<string>(['/src/**/*.{ts,tsx}', '!/src/**/*.test.{ts,tsx}'], {
  eager: true,
  query: '?raw',
  import: 'default',
})
const sources = Object.entries(raw).map(([path, text]) => ({ path, text }))

function offenders(pattern: RegExp) {
  return sources.filter(({ text }) => pattern.test(text)).map(({ path }) => path)
}

describe('no fake authentication or credential storage', () => {
  it('finds source files to check', () => {
    expect(sources.length).toBeGreaterThan(20)
  })

  it('never uses browser storage', () => {
    expect(offenders(/\b(localStorage|sessionStorage|indexedDB)\b|document\.cookie/)).toEqual([])
  })

  it('never calls Discord or builds an OAuth authorisation URL', () => {
    expect(offenders(/discord(app)?\.com\/(api|oauth2)|oauth2\/authorize|client_secret|response_type=/i)).toEqual([])
  })

  it('never handles tokens', () => {
    expect(offenders(/access_token|refresh_token|id_token|\bBearer\b|\bsetItem\b/)).toEqual([])
  })

  it('has no mock sign-in helpers', () => {
    expect(offenders(/\b(fakeLogin|mockLogin|fakeSession|mockSession|simulateSignIn)\b/i)).toEqual([])
  })
})
