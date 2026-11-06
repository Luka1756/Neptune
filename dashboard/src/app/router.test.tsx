import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { personalSection, serverSections } from '@/shared/config/sections'
import { accessibilityViolations } from '@/test/axe'
import { GUILD_ID, renderRoute } from '@/test/renderRoute'

const heading = (name: string | RegExp) => screen.findByRole('heading', { level: 1, name })
const mainNav = () => within(screen.getByRole('navigation', { name: 'Main' }))

describe('entry and authentication boundary', () => {
  it('sends / to the login screen', async () => {
    const { router } = renderRoute('/')
    expect(await heading(/sign-in isn.t available yet/i)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
  })

  it('does not pretend sign-in works: the login screen has no sign-in button', async () => {
    renderRoute('/login')
    await heading(/sign-in isn.t available yet/i)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse the preview' })).toHaveAttribute('href', '/servers')
  })

  it('shows the preview notice on app pages while the backend is not connected', async () => {
    renderRoute('/servers')
    await heading('Servers')
    expect(screen.getByRole('note')).toHaveTextContent(/sign-in isn.t connected yet/i)
  })

  it('redirects signed-out visitors from app pages to the login screen', async () => {
    const { router } = renderRoute('/servers', { status: 'signed-out' })
    expect(await heading(/sign-in isn.t available yet/i)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
  })

  it('redirects signed-out visitors away from a server page too', async () => {
    const { router } = renderRoute(`/g/${GUILD_ID}/utilities`, { status: 'signed-out' })
    await heading(/sign-in isn.t available yet/i)
    expect(router.state.location.pathname).toBe('/login')
  })

  it('shows a loading state while the session is being checked, and no app page yet', async () => {
    renderRoute('/servers', { status: 'loading' })

    expect(await screen.findByText(/checking your session/i)).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Main' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })

  it('shows app pages without the preview notice once signed in, and skips the login screen', async () => {
    const { router } = renderRoute('/login', { status: 'signed-in' })
    await heading('Servers')
    expect(router.state.location.pathname).toBe('/servers')
    expect(screen.queryByRole('note')).not.toBeInTheDocument()
  })
})

describe('server routes', () => {
  it('redirects /g/:guildId to the overview', async () => {
    const { router } = renderRoute(`/g/${GUILD_ID}`)
    await heading('Overview')
    expect(router.state.location.pathname).toBe(`/g/${GUILD_ID}/overview`)
  })

  it.each(serverSections.map((section) => [section.label, section.path] as const))(
    '%s renders at /g/:guildId/%s',
    async (label, path) => {
      renderRoute(`/g/${GUILD_ID}/${path}`)
      expect(await heading(label)).toBeInTheDocument()
      expect(document.title).toBe(`${label} – Neptune`)
    },
  )

  it('lists the navigation categories with their exact names, in order', async () => {
    renderRoute(`/g/${GUILD_ID}/overview`)
    await heading('Overview')

    const labels = mainNav()
      .getAllByRole('link')
      .map((link) => link.textContent)
    expect(labels).toEqual([
      'Neptune', // wordmark link
      'Switch server',
      'Overview',
      'Utilities',
      'Configuration',
      'Automation',
      'Information',
      'Integrations',
      'Personalisation',
    ])
  })

  it('makes clear which server is selected', async () => {
    renderRoute(`/g/${GUILD_ID}/utilities`)
    await heading('Utilities')
    expect(mainNav().getByText('Selected server')).toBeInTheDocument()
    expect(mainNav().getByText(`ID ${GUILD_ID}`)).toBeInTheDocument()
  })

  it('marks only the current section as the current page', async () => {
    renderRoute(`/g/${GUILD_ID}/configuration`)
    await heading('Configuration')

    const current = mainNav().getAllByRole('link', { current: 'page' })
    expect(current).toHaveLength(1)
    expect(current[0]).toHaveTextContent('Configuration')
  })

  it('separates server settings from personal settings in the navigation', async () => {
    renderRoute(`/g/${GUILD_ID}/overview`)
    await heading('Overview')

    expect(mainNav().getByRole('list', { name: 'This server' })).toBeInTheDocument()
    const account = mainNav().getByRole('list', { name: 'Your account' })
    expect(within(account).getAllByRole('link')).toHaveLength(1)
    expect(within(account).getByRole('link', { name: 'Personalisation' })).toHaveAttribute(
      'href',
      '/me/personalisation',
    )
  })

  it('rejects a malformed server ID with a clear message', async () => {
    renderRoute('/g/not-a-server/overview')
    expect(await heading(/isn.t a valid server id/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to servers' })).toHaveAttribute('href', '/servers')
  })

  it('moves focus to the page after navigating', async () => {
    renderRoute(`/g/${GUILD_ID}/overview`)
    await heading('Overview')

    await userEvent.click(mainNav().getByRole('link', { name: 'Utilities' }))
    await heading('Utilities')
    expect(screen.getByRole('main')).toHaveFocus()
  })
})

describe('personal routes', () => {
  it('renders /me/personalisation without a selected server', async () => {
    renderRoute('/me/personalisation')
    expect(await heading(personalSection.label)).toBeInTheDocument()
    expect(mainNav().queryByText('Selected server')).not.toBeInTheDocument()
    expect(mainNav().getByRole('link', { name: 'Servers' })).toBeInTheDocument()
  })
})

describe('Coming soon sections', () => {
  it.each(
    serverSections.filter((section) => section.status === 'coming-soon').map((section) => [section.label, section.path] as const),
  )('%s shows Coming soon and offers no settings to change', async (_label, path) => {
    renderRoute(`/g/${GUILD_ID}/${path}`)
    await screen.findByText('Coming soon', { selector: 'p' })

    const main = within(screen.getByRole('main'))
    expect(main.queryAllByRole('switch')).toHaveLength(0)
    expect(main.queryAllByRole('checkbox')).toHaveLength(0)
    expect(main.queryAllByRole('textbox')).toHaveLength(0)
    expect(main.queryAllByRole('combobox')).toHaveLength(0)
    expect(main.queryAllByRole('button')).toHaveLength(0)
  })

  it('Personalisation shows Coming soon and offers no settings to change', async () => {
    renderRoute('/me/personalisation')
    await screen.findByText('Coming soon', { selector: 'p' })
    expect(within(screen.getByRole('main')).queryAllByRole('switch')).toHaveLength(0)
  })

  it('Overview invents no statistics: it says nothing is connected', async () => {
    renderRoute(`/g/${GUILD_ID}/overview`)
    await heading('Overview')
    expect(screen.getByText(/no statistics or activity to show/i)).toBeInTheDocument()
  })
})

describe('Servers page', () => {
  it('explains that server selection depends on Discord authentication and the backend', async () => {
    renderRoute('/servers')

    expect(await screen.findByText(/server selection isn.t available yet/i)).toBeInTheDocument()
    expect(screen.getByText(/once discord authentication and the backend are implemented/i)).toBeInTheDocument()
  })

  it('has no form, inputs or buttons: there is no way to pick or open a server yet', async () => {
    renderRoute('/servers')
    await heading('Servers')

    const main = within(screen.getByRole('main'))
    expect(main.queryAllByRole('textbox')).toHaveLength(0)
    expect(main.queryAllByRole('button')).toHaveLength(0)
    expect(main.queryAllByRole('combobox')).toHaveLength(0)
    expect(main.queryAllByRole('link')).toHaveLength(0)
    expect(screen.queryByLabelText('Server ID')).not.toBeInTheDocument()
    expect(screen.queryByText(/open a server by id/i)).not.toBeInTheDocument()
    expect(document.querySelector('main form')).toBeNull()
  })

  it('stays the same for every session state', async () => {
    renderRoute('/servers', { status: 'signed-in' })
    await heading('Servers')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})

describe('mobile navigation', () => {
  it('opens a drawer with the same navigation and closes it after choosing a section', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute(`/g/${GUILD_ID}/overview`)
    await heading('Overview')

    await user.click(screen.getByRole('button', { name: 'Open navigation' }))
    const dialog = await screen.findByRole('dialog', { name: 'Navigation' })
    expect(within(dialog).getByRole('link', { name: 'Utilities' })).toBeInTheDocument()

    await user.click(within(dialog).getByRole('link', { name: 'Utilities' }))

    expect(router.state.location.pathname).toBe(`/g/${GUILD_ID}/utilities`)
    await heading('Utilities')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes with the close button and with Escape', async () => {
    const user = userEvent.setup()
    renderRoute(`/g/${GUILD_ID}/overview`)
    await heading('Overview')

    await user.click(screen.getByRole('button', { name: 'Open navigation' }))
    await user.click(await screen.findByRole('button', { name: 'Close navigation' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open navigation' }))
    await screen.findByRole('dialog')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('unknown routes', () => {
  it('shows a not-found page with a way back', async () => {
    renderRoute('/does/not/exist')
    expect(await heading('Page not found')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to servers' })).toHaveAttribute('href', '/servers')
  })
})

describe('automated accessibility checks', () => {
  it.each([
    ['login', '/login'],
    ['servers', '/servers'],
    ['overview', `/g/${GUILD_ID}/overview`],
    ['utilities', `/g/${GUILD_ID}/utilities`],
    ['personalisation', '/me/personalisation'],
    ['not found', '/nope'],
    ['invalid server id', '/g/abc/overview'],
  ])('%s has no axe violations', async (_name, path) => {
    const { container } = renderRoute(path)
    await screen.findByRole('heading', { level: 1 })
    expect(await accessibilityViolations(container)).toEqual([])
  })

  it('the open mobile drawer has no axe violations', async () => {
    const user = userEvent.setup()
    renderRoute(`/g/${GUILD_ID}/overview`)
    await heading('Overview')
    await user.click(screen.getByRole('button', { name: 'Open navigation' }))
    const dialog = await screen.findByRole('dialog')
    expect(await accessibilityViolations(dialog)).toEqual([])
  })
})
