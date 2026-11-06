import { z } from 'zod'

/**
 * Environment configuration.
 *
 * Every VITE_ variable is bundled into the page and visible to every visitor,
 * so only public values belong here. Secrets (the Discord client secret, the
 * bot token) must never be added to the dashboard.
 */

const rawEnvSchema = z.object({
  // Empty or missing means "the backend is not connected yet".
  VITE_API_BASE_URL: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .pipe(z.url({ protocol: /^https?$/, message: 'must be an http(s) URL' }).optional()),
})

export interface DashboardEnv {
  /** Base URL of the backend API without a trailing slash, or null when not configured. */
  apiBaseUrl: string | null
  /** Human-readable problems with the configuration. Empty when everything is fine. */
  issues: string[]
}

export function parseEnv(raw: Record<string, unknown>): DashboardEnv {
  const result = rawEnvSchema.safeParse(raw)

  if (!result.success) {
    return {
      apiBaseUrl: null,
      issues: result.error.issues.map((issue) => {
        const name = issue.path.join('.') || 'environment'
        return `${name} ${issue.message}`
      }),
    }
  }

  const url = result.data.VITE_API_BASE_URL
  return { apiBaseUrl: url ? url.replace(/\/+$/, '') : null, issues: [] }
}

export const env: DashboardEnv = parseEnv(import.meta.env)
