import { env } from '@/shared/config/env'

/**
 * The integration boundary for the Neptune backend.
 *
 * This file deliberately contains NO endpoint paths, response shapes or
 * models. The backend owns the API contract and will publish an OpenAPI
 * schema into `shared/contract/`; typed calls are built on top of
 * `apiRequest` once that exists. See `docs/contract-workflow.md`.
 *
 * Sign-in is handled by the backend with a secure, HTTP-only session cookie,
 * so requests are sent with `credentials: 'include'` and the dashboard never
 * sees or stores a token.
 */

/** A response with a non-2xx status. */
export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `Request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

/** Thrown when a request is attempted before the API base URL has been configured. */
export class ApiNotConfiguredError extends Error {
  constructor() {
    super('The backend API is not configured. Set VITE_API_BASE_URL.')
    this.name = 'ApiNotConfiguredError'
  }
}

export const isUnauthorised = (error: unknown): boolean =>
  error instanceof ApiError && error.status === 401

export const isForbidden = (error: unknown): boolean =>
  error instanceof ApiError && error.status === 403

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  /** Sent as JSON. */
  body?: unknown
  signal?: AbortSignal
  /**
   * Extra headers for this request. Cookie-authenticated writes will need the
   * backend's CSRF header here; the scheme is still to be defined by the backend.
   */
  headers?: Record<string, string>
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined
  const text = await response.text()
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiRequestOptions = {},
  baseUrl: string | null = env.apiBaseUrl,
): Promise<T> {
  if (!baseUrl) throw new ApiNotConfiguredError()

  const { method = 'GET', body, signal, headers } = options

  const response = await fetch(`${baseUrl}${path.startsWith('/') ? path : `/${path}`}`, {
    method,
    signal,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await readBody(response)
  if (!response.ok) throw new ApiError(response.status, data)
  return data as T
}
