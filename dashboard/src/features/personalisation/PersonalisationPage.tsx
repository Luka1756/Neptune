import { ComingSoon, PageHeader } from '@/shared/ui'

export function Component() {
  return (
    <>
      <PageHeader title="Personalisation" description="Your own preferences, applied across all servers." />
      <ComingSoon
        title="Personal preferences aren’t available yet"
        needs={[
          'Discord sign-in through the backend',
          'The Neptune backend API',
          'Support for personal preferences in the bot',
        ]}
      >
        Preferences such as whether Neptune replies to you privately will be managed here.
      </ComingSoon>
    </>
  )
}
