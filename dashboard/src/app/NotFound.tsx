import { ButtonLink, ErrorState } from '@/shared/ui'

export function NotFound() {
  return (
    <ErrorState title="Page not found" action={<ButtonLink to="/servers">Go to servers</ButtonLink>}>
      There’s nothing at this address. Check the link, or start again from the server list.
    </ErrorState>
  )
}
