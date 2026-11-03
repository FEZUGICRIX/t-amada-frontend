import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import TripSearchForm from './TripSearchForm'

describe('TripSearchForm', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 3))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('hides the return date for a one-way trip', () => {
    render(<TripSearchForm />)

    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Билет в одну сторону',
      }),
    )

    expect(
      screen.queryByRole('button', { name: /Обратно/ }),
    ).not.toBeInTheDocument()
  })

  it('shows empty date fields initially', () => {
    render(<TripSearchForm />)

    expect(
      screen.getByRole('button', { name: /Когда/ }),
    ).toHaveTextContent('Выберите дату')

    expect(
      screen.getByRole('button', { name: /Обратно/ }),
    ).toHaveTextContent('Выберите дату')
  })

  it('opens the current month calendar from the departure button', () => {
    render(<TripSearchForm />)

    fireEvent.click(
      screen.getByRole('button', { name: /Когда/ }),
    )

    expect(
      screen.getByRole('dialog', { name: 'Выбор даты' }),
    ).toBeInTheDocument()

    expect(screen.getByText('Ноябрь')).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: '3 ноября 2026',
      }),
    ).toHaveAttribute('aria-current', 'date')
  })

  it('keeps the calendar open after selecting a date range', () => {
    render(<TripSearchForm />)

    fireEvent.click(
      screen.getByRole('button', { name: /Когда/ }),
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: '5 ноября 2026',
      }),
    )

    expect(
      screen.getByRole('button', { name: /Когда/ }),
    ).toHaveTextContent('5 ноября')
    expect(
      screen.getByRole('dialog', { name: 'Выбор даты' }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: '8 ноября 2026',
      }),
    )

    expect(
      screen.getByRole('button', { name: /Обратно/ }),
    ).toHaveTextContent('8 ноября')
    expect(
      screen.queryByRole('dialog', { name: 'Выбор даты' }),
    ).toBeInTheDocument()
  })

  it('keeps the calendar open after selecting a one-way date', () => {
    render(<TripSearchForm />)

    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Билет в одну сторону',
      }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: /Когда/ }),
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: '5 ноября 2026',
      }),
    )

    expect(
      screen.queryByRole('dialog', { name: 'Выбор даты' }),
    ).toBeInTheDocument()
  })
})
