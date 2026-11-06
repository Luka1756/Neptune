import { Outlet, useParams } from 'react-router'
import { isSnowflake } from '@/shared/lib/discord'
import { ButtonLink, ErrorState } from '@/shared/ui'

/**
 * Wraps every `/g/:guildId/*` page. Rejects malformed IDs early.
 *
 * A well-formed ID does not mean the person may manage that server, or that
 * Neptune is in it. That check belongs to the backend and will be surfaced
 * here (as a "no access" state) once the API contract provides it.
 */
export function GuildLayout() {
  const { guildId } = useParams()

  if (!isSnowflake(guildId)) {
    return (
      <ErrorState
        title="That isn’t a valid server ID"
        action={<ButtonLink to="/servers">Back to servers</ButtonLink>}
      >
        Discord server IDs are 17 to 20 digits long. Check the address, or choose a server again.
      </ErrorState>
    )
  }

  return <Outlet />
}
