import { describe, expect, it } from 'vitest'
import { parseEnv } from './env'

describe('parseEnv', () => {
  it('treats a missing API base URL as "not configured"', () => {
    expect(parseEnv({})).toEqual({ apiBaseUrl: null, authStartUrl: null, issues: [] })
  })

  it('treats an empty or blank API base URL as "not configured"', () => {
    expect(parseEnv({ VITE_API_BASE_URL: '' })).toEqual({ apiBaseUrl: null, authStartUrl: null, issues: [] })
    expect(parseEnv({ VITE_API_BASE_URL: '   ' })).toEqual({ apiBaseUrl: null, authStartUrl: null, issues: [] })
  })

  it('accepts an http(s) URL and removes trailing slashes', () => {
    expect(parseEnv({ VITE_API_BASE_URL: 'https://api.example.com/' }).apiBaseUrl).toBe('https://api.example.com')
    expect(parseEnv({ VITE_API_BASE_URL: ' http://localhost:8000// ' }).apiBaseUrl).toBe('http://localhost:8000')
  })

  it('keeps a path prefix', () => {
    expect(parseEnv({ VITE_API_BASE_URL: 'https://example.com/api' }).apiBaseUrl).toBe('https://example.com/api')
  })

  it('reports a value that is not a URL', () => {
    const result = parseEnv({ VITE_API_BASE_URL: 'not a url' })
    expect(result.apiBaseUrl).toBeNull()
    expect(result.issues).toHaveLength(1)
    expect(result.issues[0]).toContain('VITE_API_BASE_URL')
  })

  it('reports a URL that is not http or https', () => {
    const result = parseEnv({ VITE_API_BASE_URL: 'ftp://example.com' })
    expect(result.apiBaseUrl).toBeNull()
    expect(result.issues[0]).toContain('VITE_API_BASE_URL')
  })

  describe('VITE_AUTH_START_URL', () => {
    it('is "not configured" when missing or blank', () => {
      expect(parseEnv({}).authStartUrl).toBeNull()
      expect(parseEnv({ VITE_AUTH_START_URL: '  ' }).authStartUrl).toBeNull()
    })

    it('accepts an https URL unchanged, including its query string', () => {
      const url = 'https://api.example.com/some/path?x=1'
      expect(parseEnv({ VITE_AUTH_START_URL: url })).toEqual({ apiBaseUrl: null, authStartUrl: url, issues: [] })
    })

    it('accepts http only for localhost', () => {
      expect(parseEnv({ VITE_AUTH_START_URL: 'http://localhost:8000/x' }).issues).toEqual([])
      const result = parseEnv({ VITE_AUTH_START_URL: 'http://example.com/x' })
      expect(result.authStartUrl).toBeNull()
      expect(result.issues[0]).toContain('VITE_AUTH_START_URL')
    })

    it('rejects values that are not http(s) URLs', () => {
      expect(parseEnv({ VITE_AUTH_START_URL: 'javascript:alert(1)' }).authStartUrl).toBeNull()
      expect(parseEnv({ VITE_AUTH_START_URL: 'not a url' }).issues[0]).toContain('VITE_AUTH_START_URL')
    })
  })
})
