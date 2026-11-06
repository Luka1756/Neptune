import { describe, expect, it } from 'vitest'
import { isSnowflake } from './discord'

describe('isSnowflake', () => {
  it.each(['12345678901234567', '123456789012345678', '1234567890123456789', '12345678901234567890'])(
    'accepts %s',
    (value) => {
      expect(isSnowflake(value)).toBe(true)
    },
  )

  it.each([
    ['too short (16 digits)', '1234567890123456'],
    ['too long (21 digits)', '123456789012345678901'],
    ['letters', '12345678901234567a'],
    ['spaces', '123456789012345678 '],
    ['a negative number', '-12345678901234567'],
    ['empty', ''],
  ])('rejects %s', (_label, value) => {
    expect(isSnowflake(value)).toBe(false)
  })

  it('rejects undefined', () => {
    expect(isSnowflake(undefined)).toBe(false)
  })
})
