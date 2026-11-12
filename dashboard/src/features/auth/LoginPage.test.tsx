import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { accessibilityViolations } from '@/test/axe'
import { renderRoute } from '@/test/renderRoute'

const START_URL = 'https://api.example.test/begin-sign-in'

// The page reads its configuration from `env`, so tests change that one object.
const mockEnv = vi.hoisted(() => ({ apiBaseUrl: null, authStartUrl: null as string | null, issues: [] as string[], warnings: [] as string[] }))
vi.mock('@/shared/config/env', () => ({ env: mockEnv }))

const heading = () => screen.findByRole('heading', { level: 1, name: 'Welcome to Neptune' })

afterEach(() => {
  mockEnv.authStartUrl = null
  mockEnv.warnings = []
})

describe('login page, sign-in not configured (the current state)', () => {
  it('renders the branding, heading and explanation', async () => {
    const { container } = renderRoute('/login')
    await heading()

    expect(screen.getAllByText('Neptune').length).toBeGreaterThan(0)
    expect(screen.getByText(/manage your servers and your personal settings/i)).toBeInTheDocument()
    expect(screen.getByText(/sign-in isn.t available yet/i)).toBeInTheDocument()
    expect(await accessibilityViolations(container)).toEqual([])
  })

  it('shows an inert Continue with Discord button that explains itself and goes nowhere', async () => {
    const { router } = renderRoute('/login')
    await heading()

    const button = screen.getByRole('button', { name: 'Continue with Discord' })
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveAccessibleDescription(/isn.t available yet/i)
    expect(screen.queryByRole('link', { name: /continue with discord/i })).not.toBeInTheDocument()

    await userEvent.click(button)
    expect(router.state.location.pathname).toBe('/login')
    expect(screen.queryByText(/redirecting/i)).not.toBeInTheDocument()
  })

  it('offers no other sign-in providers', async () => {
    renderRoute('/login')
    await heading()
    expect(screen.getAllByRole('button')).toHaveLength(1)
    expect(screen.queryByText(/google|github|apple|microsoft|email/i)).not.toBeInTheDocument()
  })

  it('shows the access-denied notice with fixed wording', async () => {
    renderRoute('/login?error=access_denied')
    await heading()
    expect(screen.getByRole('alert')).toHaveTextContent('Access wasn’t granted')
  })

  it('shows a generic failure notice and never echoes technical details from the URL', async () => {
    renderRoute('/login?error=invalid_grant&error_description=Secret%20detail%20123')
    await heading()
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('We couldn’t sign you in')
    expect(document.body).not.toHaveTextContent(/invalid_grant|secret detail|123/i)
  })

  it('shows no notice when there was no error', async () => {
    renderRoute('/login')
    await heading()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows a loading state while the session is checked', async () => {
    renderRoute('/login', { status: 'loading' })
    expect(await screen.findByText(/checking your session/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /continue with discord/i })).not.toBeInTheDocument()
  })

  it('sends someone who is already signed in to /servers', async () => {
    const { router } = renderRoute('/login', { status: 'signed-in' })
    await screen.findByRole('heading', { level: 1, name: 'Servers' })
    expect(router.state.location.pathname).toBe('/servers')
  })

  it('hides the preview link once the backend session is known', async () => {
    renderRoute('/login', { status: 'signed-out' })
    await heading()
    expect(screen.queryByRole('link', { name: 'Browse the preview' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue with Discord' })).toBeInTheDocument()
  })
})

describe('login page, sign-in address set but invalid', () => {
  it('says sign-in is unavailable because of setup, keeps the button inert, and shows no technical detail', async () => {
    mockEnv.warnings = ['VITE_AUTH_START_URL must use https (http is only allowed for localhost)']
    renderRoute('/login')
    await heading()

    const button = screen.getByRole('button', { name: 'Continue with Discord' })
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveAccessibleDescription(/isn.t set up correctly on this dashboard/i)
    expect(screen.queryByText(/isn.t available yet/i)).not.toBeInTheDocument()
    expect(document.body).not.toHaveTextContent(/VITE_|https \(http/i)
    expect(screen.getByRole('link', { name: 'Browse the preview' })).toBeInTheDocument()
  })
})

describe('login page, sign-in configured', () => {
  function renderConfigured() {
    mockEnv.authStartUrl = START_URL
    return renderRoute('/login', { status: 'signed-out' })
  }

  it('renders a real link to the configured address, as a full navigation', async () => {
    renderConfigured()
    await heading()

    const link = screen.getByRole('link', { name: 'Continue with Discord' })
    expect(link).toHaveAttribute('href', START_URL)
    expect(link).not.toHaveAttribute('target')
    expect(screen.queryByRole('button', { name: /continue with discord/i })).not.toBeInTheDocument()
    expect(link).toHaveAccessibleDescription(/sign in on discord/i)
  })

  it('shows a redirecting state after the click, and resets if the page is restored', async () => {
    renderConfigured()
    await heading()

    const link = screen.getByRole('link', { name: 'Continue with Discord' })
    link.addEventListener('click', (event) => event.preventDefault()) // jsdom can't navigate away
    await userEvent.click(link)
    expect(screen.getByRole('link', { name: 'Redirecting to Discord…' })).toHaveAttribute('aria-busy', 'true')

    window.dispatchEvent(new Event('pageshow'))
    expect(await screen.findByRole('link', { name: 'Continue with Discord' })).toBeInTheDocument()
  })
})
