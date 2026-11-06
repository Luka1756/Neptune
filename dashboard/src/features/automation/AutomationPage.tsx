import { ComingSoon, PageHeader } from '@/shared/ui'

export function Component() {
  return (
    <>
      <PageHeader title="Automation" description="Planned for a later release." />
      <ComingSoon title="Automation isn’t available yet">
        This section isn’t part of the first release, and its features haven’t been defined.
      </ComingSoon>
    </>
  )
}
