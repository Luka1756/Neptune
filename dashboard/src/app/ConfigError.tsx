import { ErrorState } from '@/shared/ui'

/** Shown instead of the app when the environment configuration is invalid. */
export function ConfigError({ issues }: { issues: readonly string[] }) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-md px-4 py-8 sm:px-8 sm:py-16">
      <ErrorState live title="The dashboard is misconfigured">
        <p>Fix these environment variables and rebuild or restart the dashboard:</p>
        <ul className="mt-2 list-disc pl-5">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      </ErrorState>
    </div>
  )
}
