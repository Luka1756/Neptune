import { render, screen } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

// App creates its router when it is first imported, from the current address, so set that first.
const mockEnv = vi.hoisted(() => ({
  apiBaseUrl: 'https://api.example.test' as string | null,
  authStartUrl: null as string | null,
  issues: [] as string[],
  warnings: [] as string[],
}))
vi.mock('@/shared/config/env', () => ({ env: mockEnv }))

// Under Vitest, 'react-router/dom' loads a second copy of React Router, so the routes' <Outlet> can't see the
// router's context and the page stays empty. Vite uses one copy in the real build. This uses the main copy instead.
vi.mock('react-router/dom', async () => ({ RouterProvider: (await import('react-router')).RouterProvider }))

let App: typeof import('./App').App

beforeAll(async () => {
  window.history.replaceState(null, '', '/login')
  ;({ App } = await import('./App'))
})

afterEach(() => {
  mockEnv.apiBaseUrl = 'https://api.example.test'
  mockEnv.authStartUrl = null
  mockEnv.issues = []
  mockEnv.warnings = []
  vi.restoreAllMocks()
})

describe('App and configuration problems', () => {
  it('still starts when only the sign-in address is invalid, and says sign-in is unavailable on /login', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockEnv.warnings = ['VITE_AUTH_START_URL must use https (http is only allowed for localhost)']

    render(<App />)

    expect(await screen.findByRole('heading', { level: 1, name: 'Welcome to Neptune' })).toBeInTheDocument()
    expect(screen.queryByText(/misconfigured/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue with Discord' })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByText(/isn.t set up correctly on this dashboard/i)).toBeInTheDocument()

    // The developer console gets the variable name and the problem, once.
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain('VITE_AUTH_START_URL must use https')
  })

  it('does not put any configuration detail on the page', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockEnv.warnings = ['VITE_AUTH_START_URL must not contain a username or password']
    render(<App />)
    await screen.findByRole('heading', { level: 1, name: 'Welcome to Neptune' })
    expect(document.body).not.toHaveTextContent(/VITE_|username|password/i)
  })

  it('does not warn when nothing is wrong', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<App />)
    await screen.findByRole('heading', { level: 1, name: 'Welcome to Neptune' })
    expect(warn).not.toHaveBeenCalled()
  })

  it('still refuses to start when the API address is invalid', () => {
    mockEnv.apiBaseUrl = null
    mockEnv.issues = ['VITE_API_BASE_URL must be an http(s) URL']

    render(<App />)

    expect(screen.getByRole('alert')).toHaveTextContent('The dashboard is misconfigured')
    expect(screen.getByText('VITE_API_BASE_URL must be an http(s) URL')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Welcome to Neptune' })).not.toBeInTheDocument()
  })

  it('shows the fatal screen, and lists only the fatal problem, when both are invalid', () => {
    mockEnv.apiBaseUrl = null
    mockEnv.issues = ['VITE_API_BASE_URL must be an http(s) URL']
    mockEnv.warnings = ['VITE_AUTH_START_URL must be an http(s) URL']

    render(<App />)

    expect(screen.getByRole('alert')).toHaveTextContent('The dashboard is misconfigured')
    expect(screen.queryByText(/VITE_AUTH_START_URL/)).not.toBeInTheDocument()
  })
})
