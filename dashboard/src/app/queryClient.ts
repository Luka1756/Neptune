import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/shared/api/client'

/** Retrying a 4xx response never helps (signed out, no access, bad request), so don't. */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false
  return failureCount < 2
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: shouldRetry,
        refetchOnWindowFocus: false,
        staleTime: 30_000,
      },
    },
  })
}
