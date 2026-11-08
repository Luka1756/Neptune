import { z } from 'zod'

/**
 * Environment configuration.
 *
 * Every VITE_ variable is bundled into the page and visible to every visitor,
 * so only public values belong here. Secrets (the Discord client secret, the
 * bot token) must never be added to the dashboard.
 */

/** Empty or missing means "not configured". Anything else must be an http(s) URL. */
const optionalHttpUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined))
  .pipe(z.url({ protocol: /^https?$/, message: 'must be an http(s) URL' }).optional())

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

/** Signing in sends a session cookie back, so plain http is only acceptable on the developer's own machine. */
function isHttpsOrLocal(value: string): boolean {
  if (!URL.canParse(value)) return true // not a URL at all: the URL check reports that
  const url = new URL(value)
  return url.protocol === 'https:' || LOCAL_HOSTS.has(url.hostname)
}

const rawEnvSchema = z.object({
  // The backend API. Empty means "the backend is not connected yet".
  VITE_API_BASE_URL: optionalHttpUrl,

  // The full address the browser is sent to in order to begin Discord sign-in.
  // The backend defines it; the dashboard never builds it. Empty means
  // "sign-in is not available yet". (The variable's name is a proposal that
  // still needs to be confirmed with the backend. See docs/sign-in.md.)
  VITE_AUTH_START_URL: optionalHttpUrl.refine((value) => value === undefined || isHttpsOrLocal(value), {
    message: 'must use https (http is only allowed for localhost)',
  }),
})

export interface DashboardEnv {
  /** Base URL of the backend API without a trailing slash, or null when not configured. */
  apiBaseUrl: string | null
  /** Where the browser goes to begin Discord sign-in, or null when sign-in isn't configured. */
  authStartUrl: string | null
  /** Human-readable problems with the configuration. Empty when everything is fine. */
  issues: string[]
}

export function parseEnv(raw: Record<string, unknown>): DashboardEnv {
  const result = rawEnvSchema.safeParse(raw)

  if (!result.success) {
    return {
      apiBaseUrl: null,
      authStartUrl: null,
      issues: result.error.issues.map((issue) => {
        const name = issue.path.join('.') || 'environment'
        return `${name} ${issue.message}`
      }),
    }
  }

  const { VITE_API_BASE_URL: apiUrl, VITE_AUTH_START_URL: authUrl } = result.data
  return {
    apiBaseUrl: apiUrl ? apiUrl.replace(/\/+$/, '') : null,
    authStartUrl: authUrl ?? null,
    issues: [],
  }
}

export const env: DashboardEnv = parseEnv(import.meta.env)
