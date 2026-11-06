/**
 * Discord IDs ("snowflakes") are 64-bit integers, sent as strings. They are
 * currently 17 to 20 digits long. Never convert them to JavaScript numbers:
 * values this large lose precision.
 */
const SNOWFLAKE_PATTERN = /^\d{17,20}$/

export function isSnowflake(value: string | undefined): value is string {
  return value !== undefined && SNOWFLAKE_PATTERN.test(value)
}
