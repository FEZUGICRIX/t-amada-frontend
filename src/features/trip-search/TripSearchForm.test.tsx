import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import TripSearchForm from './TripSearchForm'

describe('TripSearchForm', () => {
  it('hides the return date for a one-way trip', async () => {
    const user = userEvent.setup()

    render(<TripSearchForm />)

    const oneWayCheckbox = screen.getByRole('checkbox', {
      name: 'Билет в одну сторону',
    })

    await user.click(oneWayCheckbox)

    expect(
      screen.queryByRole('button', { name: /Обратно/ }),
    ).not.toBeInTheDocument()
  })
})