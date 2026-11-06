import { ComingSoon, PageHeader } from '@/shared/ui'

export function Component() {
  return (
    <>
      <PageHeader title="Utilities" description="Choose which tool categories this server can use." />
      <ComingSoon
        title="Utility settings aren’t available yet"
        needs={['The Neptune backend API', 'Support for per-server settings in the bot']}
      >
        Turning tool categories on or off for this server will be managed here.
      </ComingSoon>
    </>
  )
}
