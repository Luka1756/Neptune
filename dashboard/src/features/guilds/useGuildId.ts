import { useParams } from 'react-router'
import { isSnowflake } from '@/shared/lib/discord'

/**
 * The server ID from the URL. Only use inside `/g/:guildId/*` routes, where
 * `GuildLayout` has already rejected anything that isn't a valid ID.
 */
export function useGuildId(): string {
  const { guildId } = useParams()
  if (!isSnowflake(guildId)) {
    throw new Error('useGuildId was used outside a valid /g/:guildId route.')
  }
  return guildId
}
