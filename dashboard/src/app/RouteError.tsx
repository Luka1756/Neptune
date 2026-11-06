import { Button, ErrorState } from '@/shared/ui'
import { Wordmark } from './layouts/Wordmark'

/** Catches errors thrown while rendering any route, so a bug never leaves a blank page. */
export function RouteError() {
  return (
    <div className="min-h-dvh px-4 py-8 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <Wordmark className="mb-10" />
        <ErrorState
          live
          title="Something went wrong"
          action={<Button onClick={() => window.location.reload()}>Reload the page</Button>}
        >
          The page hit an unexpected problem. Reloading usually fixes it.
        </ErrorState>
      </div>
    </div>
  )
}
