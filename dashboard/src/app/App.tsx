import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { env } from '@/shared/config/env'
import { ConfigError } from './ConfigError'
import { createQueryClient } from './queryClient'
import { routes } from './router'

const queryClient = createQueryClient()
const router = createBrowserRouter(routes)

export function App() {
  // Non-fatal configuration problems (names only, never values) go to the developer console.
  useEffect(() => {
    for (const warning of env.warnings) console.warn(`[Neptune] ${warning}. Sign-in is unavailable.`)
  }, [])

  if (env.issues.length > 0) return <ConfigError issues={env.issues} />

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
