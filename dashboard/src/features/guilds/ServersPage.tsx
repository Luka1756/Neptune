import { ComingSoon, PageHeader } from '@/shared/ui'

export function Component() {
  return (
    <>
      <PageHeader title="Servers" description="Choose a server to manage." />
      <ComingSoon
        title="Server selection isn’t available yet"
        needs={['Discord sign-in through the backend', 'The Neptune backend API']}
      >
        Server selection will become available once Discord authentication and the backend are implemented.
      </ComingSoon>
    </>
  )
}
