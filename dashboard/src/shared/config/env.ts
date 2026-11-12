import { z } from 'zod'

/**
 * Environment configuration.
 *
 * Every VITE_ variable is bundled into the page and visible to every visitor,
 * so only public values belong here. Secrets (the Discord client secret, the
 * bot token) must never be added to the dashboard.
 */

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

/** Returns what is wrong with a URL setting, or null when it is fine. Never repeats the value itself. */
function urlProblem(value: string, { secureOnly }: { secureOnly: boolean }): string | null {
  // Whitespace and control characters are stripped by URL parsers, so the parsed URL would differ from what is used.
  if ([...value].some((char) => char.charCodeAt(0) <= 0x20 || char.charCodeAt(0) === 0x7f)) {
    return 'must be an http(s) URL'
  }

  let url: URL
  try {
    url = new URL(value)
  } catch {
    return 'must be an http(s) URL'
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'must be an http(s) URL'

  // Written as `scheme://host`. "https:example.com" and "https:///x" parse, but not to what they look like.
  if (!/^https?:\/\/[^/?#\\]/i.test(value) || url.hostname === '') return 'must include a host name'

  // VITE_ values are public, so credentials in a URL would be published with the page.
  if (url.username !== '' || url.password !== '') return 'must not contain a username or password'

  // Signing in sends a session cookie back, so plain http is only acceptable on the developer's own machine.
  if (secureOnly && url.protocol === 'http:' && !LOCAL_HOSTS.has(url.hostname)) {
    return 'must use https (http is only allowed for localhost)'
  }
  return null
}

/**
 * An optional URL setting. Empty or missing means "not configured". Anything else must pass
 * `urlProblem`. At most one issue is reported, so a bad value never produces a second, misleading message.
 */
const optionalUrl = (options: { secureOnly: boolean }) =>
  z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .superRefine((value, ctx) => {
      const problem = value === undefined ? null : urlProblem(value, options)
      if (problem) ctx.addIssue({ code: 'custom', message: problem })
    })

// Each variable is validated on its own, so one bad value never disables another.
const apiBaseUrlSchema = optionalUrl({ secureOnly: false })

// The full address the browser is sent to in order to begin Discord sign-in.
// The backend defines it; the dashboard never builds it. Empty means
// "sign-in is not available yet". (The variable's name is a proposal that
// still needs to be confirmed with the backend. See docs/sign-in.md.)
const authStartUrlSchema = optionalUrl({ secureOnly: true })

export interface DashboardEnv {
  /** Base URL of the backend API without a trailing slash, or null when not configured. */
  apiBaseUrl: string | null
  /** Where the browser goes to begin Discord sign-in, or null when sign-in isn't available. */
  authStartUrl: string | null
  /**
   * Fatal problems: the dashboard must not start. Today that is only the API URL.
   * Messages name the variable and the problem, never the value.
   */
  issues: string[]
  /**
   * Non-fatal problems: the dashboard starts, but the affected feature is unavailable.
   * Today that is only the sign-in address. Same rules for messages as `issues`.
   */
  warnings: string[]
}

/** Validates one variable. A bad value gives `null` plus a readable issue, never an exception. */
function readUrl(name: string, schema: z.ZodType<string | undefined>, value: unknown) {
  const result = schema.safeParse(value)
  if (result.success) return { url: result.data ?? null, issues: [] as string[] }
  return { url: null, issues: result.error.issues.map((issue) => `${name} ${issue.message}`) }
}

export function parseEnv(raw: Record<string, unknown>): DashboardEnv {
  const api = readUrl('VITE_API_BASE_URL', apiBaseUrlSchema, raw.VITE_API_BASE_URL)
  const auth = readUrl('VITE_AUTH_START_URL', authStartUrlSchema, raw.VITE_AUTH_START_URL)

  return {
    apiBaseUrl: api.url ? api.url.replace(/\/+$/, '') : null,
    authStartUrl: auth.url,
    issues: api.issues,
    warnings: auth.issues,
  }
}

export const env: DashboardEnv = parseEnv(import.meta.env)
