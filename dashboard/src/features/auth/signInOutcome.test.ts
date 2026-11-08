import { describe, expect, it } from 'vitest'
import { parseSignInOutcome } from './signInOutcome'

const parse = (query: string) => parseSignInOutcome(new URLSearchParams(query))

describe('parseSignInOutcome', () => {
  it('reports nothing when there is no error', () => {
    expect(parse('')).toBeNull()
    expect(parse('error=')).toBeNull()
    expect(parse('other=1')).toBeNull()
  })

  it('maps access_denied to declined', () => {
    expect(parse('error=access_denied')).toBe('declined')
  })

  it('maps every other error to a generic failure', () => {
    expect(parse('error=server_error')).toBe('failed')
    expect(parse('error=<script>alert(1)</script>')).toBe('failed')
  })
})
