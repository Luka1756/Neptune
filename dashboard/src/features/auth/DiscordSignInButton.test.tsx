import { fireEvent, render, screen } from '@testing-library/react'
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

describe('modified clicks on the configured link', () => {
  const URL_ = 'https://api.example.test/begin'

  /** jsdom can't navigate, so cancel the default action. This does not change what React sees. */
  function setup() {
    const view = render(<DiscordSignInButton startUrl={URL_} />)
    const link = screen.getByRole('link', { name: 'Continue with Discord' })
    link.addEventListener('click', (event) => event.preventDefault())
    return { ...view, link }
  }

  it.each([
    ['Ctrl', { ctrlKey: true }],
    ['Cmd', { metaKey: true }],
    ['Shift', { shiftKey: true }],
    ['Alt', { altKey: true }],
    ['a non-primary button', { button: 1 }],
    ['the secondary button', { button: 2 }],
  ])('does not enter the redirecting state on %s-click', (_label, init) => {
    const { link } = setup()
    fireEvent.click(link, init)

    expect(screen.getByRole('link', { name: 'Continue with Discord' })).toBe(link)
    expect(link).not.toHaveAttribute('aria-busy')
    expect(screen.queryByText(/redirecting/i)).not.toBeInTheDocument()
  })

  it('still enters the redirecting state on an ordinary left click', async () => {
    const { link } = setup()
    await userEvent.click(link)
    expect(screen.getByRole('link', { name: 'Redirecting to Discord…' })).toHaveAttribute('aria-busy', 'true')
  })

  it('works with a real Ctrl-click sequence from the keyboard and mouse', async () => {
    const { link } = setup()
    const user = userEvent.setup() // one instance, so it remembers that Control is held
    await user.keyboard('{Control>}')
    await user.click(link)
    await user.keyboard('{/Control}')
    expect(link).not.toHaveAttribute('aria-busy')
    expect(link).toHaveAccessibleName('Continue with Discord')
  })

  it('keeps the href, so the browser can still open it in a new tab', () => {
    const { link } = setup()
    expect(link).toHaveAttribute('href', URL_)
  })
})

describe('pickIconUrl', () => {
  it('returns null when no asset exists, and the URL when one does', () => {
    expect(pickIconUrl({})).toBeNull()
    expect(pickIconUrl({ '/src/assets/discord-mark.svg': '/x.svg' })).toBe('/x.svg')
  })
})
