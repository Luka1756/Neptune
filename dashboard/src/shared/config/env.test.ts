import { describe, expect, it } from 'vitest'
import { parseEnv } from './env'

const API = 'https://api.example.com/'
const AUTH = 'https://api.example.com/begin'

const NONE = { apiBaseUrl: null, authStartUrl: null, issues: [], warnings: [] }

describe('parseEnv: VITE_API_BASE_URL', () => {
  it('treats a missing value as "not configured"', () => {
    expect(parseEnv({})).toEqual(NONE)
  })

  it('treats an empty or blank value as "not configured"', () => {
    expect(parseEnv({ VITE_API_BASE_URL: '' })).toEqual(NONE)
    expect(parseEnv({ VITE_API_BASE_URL: '   ' })).toEqual(NONE)
  })

  it('accepts an http(s) URL and removes trailing slashes', () => {
    expect(parseEnv({ VITE_API_BASE_URL: 'https://api.example.com///' }).apiBaseUrl).toBe('https://api.example.com')
  })

  it('keeps a path prefix', () => {
    expect(parseEnv({ VITE_API_BASE_URL: 'https://example.com/api/v1/' }).apiBaseUrl).toBe('https://example.com/api/v1')
  })

  it('reports a value that is not a URL as a fatal issue', () => {
    const result = parseEnv({ VITE_API_BASE_URL: 'not a url' })
    expect(result.apiBaseUrl).toBeNull()
    expect(result.issues).toEqual(['VITE_API_BASE_URL must be an http(s) URL'])
    expect(result.warnings).toEqual([])
  })

  it('reports a URL that is not http or https', () => {
    expect(parseEnv({ VITE_API_BASE_URL: 'ftp://example.com' }).issues).toEqual([
      'VITE_API_BASE_URL must be an http(s) URL',
    ])
  })

  it('rejects credentials in the URL', () => {
    const result = parseEnv({ VITE_API_BASE_URL: 'https://user:secret@example.com' })
    expect(result.apiBaseUrl).toBeNull()
    expect(result.issues).toEqual(['VITE_API_BASE_URL must not contain a username or password'])
  })
})

describe('parseEnv: VITE_AUTH_START_URL', () => {
  const warn = (value: string) => parseEnv({ VITE_AUTH_START_URL: value }).warnings

  it('is "not configured" when missing or blank, without a warning', () => {
    expect(parseEnv({})).toEqual(NONE)
    expect(parseEnv({ VITE_AUTH_START_URL: '  ' })).toEqual(NONE)
  })

  it('accepts an https URL unchanged, including its query string', () => {
    const url = 'https://api.example.com/some/path?x=1'
    expect(parseEnv({ VITE_AUTH_START_URL: url })).toEqual({ ...NONE, authStartUrl: url })
  })

  it('accepts http only for localhost, 127.0.0.1 and [::1], in any letter case', () => {
    for (const url of ['http://localhost:8000/x', 'http://127.0.0.1:8000/x', 'http://[::1]:8000/x', 'HTTP://LOCALHOST/x']) {
      const result = parseEnv({ VITE_AUTH_START_URL: url })
      expect(result.authStartUrl).toBe(url)
      expect(result.warnings).toEqual([])
    }
  })

  it('rejects http for any other host, including look-alikes of localhost', () => {
    for (const url of ['http://example.com/x', 'http://localhost.evil.com/x', 'http://localhost@evil.com/x', 'http://127.0.0.2/x']) {
      expect(parseEnv({ VITE_AUTH_START_URL: url }).authStartUrl).toBeNull()
    }
    expect(warn('http://example.com/x')).toEqual([
      'VITE_AUTH_START_URL must use https (http is only allowed for localhost)',
    ])
  })

  it.each([
    ['not a url'],
    ['/relative/path'],
    ['//evil.com/x'],
    ['https://exa mple.com'],
    ['https://example.com/\nx'],
    ['https://'],
    ['undefined'],
  ])('rejects %j as not an http(s) URL, or without a host, with a single warning', (value) => {
    const result = parseEnv({ VITE_AUTH_START_URL: value })
    expect(result.authStartUrl).toBeNull()
    expect(result.issues).toEqual([])
    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0]).toMatch(/^VITE_AUTH_START_URL must (be an http\(s\) URL|include a host name)$/)
  })

  it.each([['https:///x'], ['https:example.com'], ['https:\\\\example.com'], ['https://?x=1'], ['https:///']])(
    'rejects %j, which parses but does not point where it looks like',
    (value) => {
      const result = parseEnv({ VITE_AUTH_START_URL: value })
      expect(result.authStartUrl).toBeNull()
      expect(result.warnings).toHaveLength(1)
    },
  )

  it('rejects credentials in the URL, and never repeats them', () => {
    for (const url of ['https://user:secret@example.com/x', 'https://user@example.com/x', 'https://:secret@example.com/x']) {
      const result = parseEnv({ VITE_AUTH_START_URL: url })
      expect(result.authStartUrl).toBeNull()
      expect(result.warnings).toEqual(['VITE_AUTH_START_URL must not contain a username or password'])
      expect(JSON.stringify(result)).not.toContain('secret')
    }
  })

  it('gives exactly one accurate message for a scheme that is not http(s)', () => {
    expect(warn('javascript:alert(1)')).toEqual(['VITE_AUTH_START_URL must be an http(s) URL'])
    expect(warn('data:text/html,hi')).toEqual(['VITE_AUTH_START_URL must be an http(s) URL'])
  })

  it('never repeats the value in any message', () => {
    for (const value of ['http://example.com/private-path-123', 'nonsense-value-456', 'https://u:pw-789@example.com']) {
      expect(JSON.stringify(warn(value))).not.toMatch(/private-path-123|nonsense-value-456|pw-789/)
    }
  })

  it('fails safely on non-string values', () => {
    const result = parseEnv({ VITE_AUTH_START_URL: 42 })
    expect(result.authStartUrl).toBeNull()
    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0]).toContain('VITE_AUTH_START_URL')
  })
})

describe('parseEnv: the two variables are independent', () => {
  it('accepts both when both are valid', () => {
    expect(parseEnv({ VITE_API_BASE_URL: API, VITE_AUTH_START_URL: AUTH })).toEqual({
      apiBaseUrl: 'https://api.example.com',
      authStartUrl: AUTH,
      issues: [],
      warnings: [],
    })
  })

  it('keeps a valid API URL when the sign-in URL is invalid, and only warns', () => {
    for (const bad of ['not a url', 'http://example.com/begin', 'https://u:p@example.com/begin']) {
      const result = parseEnv({ VITE_API_BASE_URL: API, VITE_AUTH_START_URL: bad })
      expect(result.apiBaseUrl).toBe('https://api.example.com')
      expect(result.authStartUrl).toBeNull()
      expect(result.issues).toEqual([])
      expect(result.warnings).toHaveLength(1)
    }
  })

  it('keeps a valid sign-in URL when the API URL is invalid, and reports the API problem as fatal', () => {
    const result = parseEnv({ VITE_API_BASE_URL: 'ftp://example.com', VITE_AUTH_START_URL: AUTH })
    expect(result.apiBaseUrl).toBeNull()
    expect(result.authStartUrl).toBe(AUTH)
    expect(result.issues).toEqual(['VITE_API_BASE_URL must be an http(s) URL'])
    expect(result.warnings).toEqual([])
  })

  it('reports each problem in its own list when both are invalid', () => {
    const result = parseEnv({ VITE_API_BASE_URL: 'nope', VITE_AUTH_START_URL: 'http://example.com' })
    expect(result.apiBaseUrl).toBeNull()
    expect(result.authStartUrl).toBeNull()
    expect(result.issues).toHaveLength(1)
    expect(result.warnings).toHaveLength(1)
  })

  it('treats an empty value as unset without affecting the other', () => {
    expect(parseEnv({ VITE_API_BASE_URL: '', VITE_AUTH_START_URL: AUTH })).toEqual({ ...NONE, authStartUrl: AUTH })
    expect(parseEnv({ VITE_API_BASE_URL: API, VITE_AUTH_START_URL: '  ' })).toEqual({
      ...NONE,
      apiBaseUrl: 'https://api.example.com',
    })
  })

  it('allows http for localhost sign-in alongside an https API', () => {
    const result = parseEnv({ VITE_API_BASE_URL: API, VITE_AUTH_START_URL: 'http://localhost:8000/begin' })
    expect(result.authStartUrl).toBe('http://localhost:8000/begin')
    expect(result.issues).toEqual([])
    expect(result.warnings).toEqual([])
  })

  it('fails safely on a non-string API value without touching the sign-in URL', () => {
    const result = parseEnv({ VITE_API_BASE_URL: 42, VITE_AUTH_START_URL: AUTH })
    expect(result.apiBaseUrl).toBeNull()
    expect(result.authStartUrl).toBe(AUTH)
    expect(result.issues[0]).toContain('VITE_API_BASE_URL')
  })
})

describe('parseEnv: browser compatibility', () => {
  it('does not depend on URL.canParse, which older supported browsers lack', () => {
    // Shadow it with undefined, as in a browser that doesn't have it.
    Object.defineProperty(URL, 'canParse', { value: undefined, configurable: true })
    try {
      expect(typeof URL.canParse).toBe('undefined')
      expect(parseEnv({ VITE_AUTH_START_URL: 'not a url' }).warnings).toHaveLength(1)
      expect(parseEnv({ VITE_AUTH_START_URL: AUTH }).authStartUrl).toBe(AUTH)
      expect(parseEnv({ VITE_API_BASE_URL: API }).apiBaseUrl).toBe('https://api.example.com')
    } finally {
      // @ts-expect-error removing only our shadow, which brings back the built-in
      delete URL.canParse
    }
    expect(typeof URL.canParse).toBe('function')
  })
})
