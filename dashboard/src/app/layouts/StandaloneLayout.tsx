import { Outlet } from 'react-router'
import { Wordmark } from './Wordmark'

/** A plain centred column for pages outside the app shell: login, not found, errors. */
export function StandaloneLayout() {
  return (
    <div className="min-h-dvh px-4 py-8 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <Wordmark className="mb-10" />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
