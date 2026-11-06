import { QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { env } from '@/shared/config/env'
import { ConfigError } from './ConfigError'
import { createQueryClient } from './queryClient'
import { routes } from './router'

const queryClient = createQueryClient()
const router = createBrowserRouter(routes)

export function App() {
  if (env.issues.length > 0) return <ConfigError issues={env.issues} />

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
