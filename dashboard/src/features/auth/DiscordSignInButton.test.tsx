import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DiscordSignInButton } from './DiscordSignInButton'
import { pickIconUrl } from './signInIcon'

// Stand-in for the asset URL only. It is not a logo.
vi.mock('./signInIcon', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./signInIcon')>()),
  discordMarkUrl: '/assets/test-mark.svg',
}))

const mark = (container: HTMLElement) => container.querySelector('img')

describe('Discord mark on the sign-in button', () => {
  it('shows the mark, hidden from assistive technology, when sign-in is not configured', () => {
    const { container } = render(<DiscordSignInButton startUrl={null} />)
    expect(mark(container)).toHaveAttribute('src', '/assets/test-mark.svg')
    expect(mark(container)).toHaveAttribute('alt', '')
    expect(screen.getByRole('button', { name: 'Continue with Discord' })).toBeInTheDocument()
  })

  it('shows the mark on the configured link, named only by its text', () => {
    const { container } = render(<DiscordSignInButton startUrl="https://api.example.test/begin" />)
    expect(mark(container)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Continue with Discord' })).toBeInTheDocument()
  })

  it('swaps the mark for a spinner while redirecting, so the state stays visible', async () => {
    const { container } = render(<DiscordSignInButton startUrl="https://api.example.test/begin" />)
    const link = screen.getByRole('link')
    link.addEventListener('click', (event) => event.preventDefault())
    await userEvent.click(link)
    expect(mark(container)).not.toBeInTheDocument()
    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument()
  })
})

describe('pickIconUrl', () => {
  it('returns null when no asset exists, and the URL when one does', () => {
    expect(pickIconUrl({})).toBeNull()
    expect(pickIconUrl({ '/src/assets/discord-mark.svg': '/x.svg' })).toBe('/x.svg')
  })
})
