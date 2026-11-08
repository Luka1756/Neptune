/**
 * The icon on the "Continue with Discord" button.
 *
 * Discord's logo is a protected brand asset, so it isn't drawn here. Until
 * Discord's official asset is added, the button shows a neutral sign-in icon.
 * To use the official one, save it as `src/assets/discord-mark.svg`: it is
 * picked up automatically, with no code change. Follow Discord's brand
 * guidelines when you do.
 */

/** Returns the first URL from a glob result, or null when no file matched. */
export function pickIconUrl(modules: Record<string, string>): string | null {
  return Object.values(modules)[0] ?? null
}

export const discordMarkUrl: string | null = pickIconUrl(
  import.meta.glob<string>('/src/assets/discord-mark.svg', { eager: true, query: '?url', import: 'default' }),
)
