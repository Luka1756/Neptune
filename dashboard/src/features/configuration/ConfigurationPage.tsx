import { ComingSoon, PageHeader } from '@/shared/ui'

export function Component() {
  return (
    <>
      <PageHeader title="Configuration" description="Server-wide settings for Neptune." />
      <ComingSoon
        title="Configuration isn’t available yet"
        needs={['The Neptune backend API', 'A decision on which settings to offer first']}
      >
        Which settings appear here hasn’t been decided yet.
      </ComingSoon>
    </>
  )
}
