import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { accessibilityViolations } from '@/test/axe'
import { Button, ButtonLink, ComingSoon, ErrorState, LoadingState, SettingsRow, Switch, TextField } from '.'

describe('Button', () => {
  it('is a non-submitting button by default and handles clicks', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toHaveAttribute('type', 'button')
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('has a touch target of at least 44px (min-h-11)', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button')).toHaveClass('min-h-11')
  })
})

describe('ButtonLink', () => {
  it('renders a link to the given route', () => {
    render(
      <MemoryRouter>
        <ButtonLink to="/servers">Go</ButtonLink>
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/servers')
  })
})

describe('Switch inside SettingsRow', () => {
  function Example() {
    const [on, setOn] = useState(false)
    return (
      <SettingsRow label="Private replies" description="Only you can see the replies.">
        {({ controlId, descriptionId }) => (
          <Switch id={controlId} aria-describedby={descriptionId} checked={on} onCheckedChange={setOn} />
        )}
      </SettingsRow>
    )
  }

  it('is announced with its label and description', () => {
    render(<Example />)
    const control = screen.getByRole('switch', { name: 'Private replies' })
    expect(control).toHaveAccessibleDescription('Only you can see the replies.')
    expect(control).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles with the mouse and the keyboard', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const control = screen.getByRole('switch', { name: 'Private replies' })

    await user.click(control)
    expect(control).toHaveAttribute('aria-checked', 'true')

    control.focus()
    await user.keyboard(' ')
    expect(control).toHaveAttribute('aria-checked', 'false')
  })

  it('has no automated accessibility violations', async () => {
    const { container } = render(<Example />)
    expect(await accessibilityViolations(container)).toEqual([])
  })
})

describe('TextField', () => {
  it('associates its label, hint and error with the input', () => {
    render(<TextField label="Server ID" hint="17 to 20 digits" error="Enter a valid ID." />)

    const input = screen.getByLabelText('Server ID')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('17 to 20 digits Enter a valid ID.')
  })

  it('is not marked invalid without an error', () => {
    render(<TextField label="Server ID" />)
    expect(screen.getByLabelText('Server ID')).not.toHaveAttribute('aria-invalid')
  })

  it('has no automated accessibility violations', async () => {
    const { container } = render(<TextField label="Server ID" hint="Digits only" error="Required." />)
    expect(await accessibilityViolations(container)).toEqual([])
  })
})

describe('ComingSoon', () => {
  it('says it is coming soon, lists what it needs, and contains no controls', () => {
    render(
      <ComingSoon title="Things aren’t available yet" needs={['The backend API', 'Bot support']}>
        Explanation.
      </ComingSoon>,
    )

    expect(screen.getByText('Coming soon')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Things aren’t available yet' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['The backend API', 'Bot support'])
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('switch')).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('omits the "Needs" list when nothing is listed', () => {
    render(<ComingSoon title="Later">Explanation.</ComingSoon>)
    expect(screen.queryByText('Needs')).not.toBeInTheDocument()
  })
})

describe('ErrorState and LoadingState', () => {
  it('announces failures only when asked to', () => {
    const { rerender } = render(<ErrorState title="Not found" />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    rerender(<ErrorState live title="Something went wrong" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
  })

  it('shows a polite loading status', () => {
    render(<LoadingState label="Checking your session" />)
    expect(screen.getByRole('status')).toHaveTextContent('Checking your session…')
  })
})
