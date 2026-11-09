import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TripSearchForm from './TripSearchForm'

describe('TripSearchForm', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 3))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('offers the same city suggestions for both route fields', () => {
    render(<TripSearchForm />)

    expect(screen.getByRole('combobox', { name: 'Откуда' })).toHaveAttribute('list', 'trip-cities')
    expect(screen.getByRole('combobox', { name: 'Куда' })).toHaveAttribute('list', 'trip-cities')

    const cityList = document.getElementById('trip-cities')
    const cityNames = [...(cityList?.querySelectorAll('option') ?? [])].map(
      (option) => option.value,
    )

    expect(cityNames).toEqual([
      'Екатеринбург',
      'Москва',
      'Санкт-Петербург',
      'Казань',
      'Нижний Новгород',
      'Сочи',
      'Самара',
      'Уфа',
      'Пермь',
      'Челябинск',
    ])
  })

  it('disables the return date for a one-way trip', () => {
    render(<TripSearchForm />)

    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Билет в одну сторону',
      }),
    )

    expect(screen.getByRole('button', { name: /Обратно/ })).toBeDisabled()
  })

  it('keeps the selected return date after toggling one-way mode', () => {
    render(<TripSearchForm />)

    fireEvent.click(screen.getByRole('button', { name: /Когда/ }))
    fireEvent.click(screen.getByRole('button', { name: '5 ноября 2026' }))
    fireEvent.click(screen.getByRole('button', { name: '8 ноября 2026' }))

    const oneWayCheckbox = screen.getByRole('checkbox', {
      name: 'Билет в одну сторону',
    })

    fireEvent.click(oneWayCheckbox)

    expect(screen.getByRole('button', { name: /Обратно/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Обратно/ })).toHaveTextContent('8 ноября')

    fireEvent.click(oneWayCheckbox)

    expect(screen.getByRole('button', { name: /Обратно/ })).toBeEnabled()
    expect(screen.getByRole('button', { name: /Обратно/ })).toHaveTextContent('8 ноября')
  })

  it('shows empty date fields initially', () => {
    render(<TripSearchForm />)

    expect(screen.getByRole('button', { name: /Когда/ })).toHaveTextContent('Выберите дату')

    expect(screen.getByRole('button', { name: /Обратно/ })).toHaveTextContent('Выберите дату')
  })

  it('opens the current month calendar from the departure button', () => {
    render(<TripSearchForm />)

    fireEvent.click(screen.getByRole('button', { name: /Когда/ }))

    expect(screen.getByRole('dialog', { name: 'Выбор даты' })).toBeInTheDocument()

    expect(screen.getByText('Ноябрь')).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: '3 ноября 2026',
      }),
    ).toHaveAttribute('aria-current', 'date')
  })

  it('keeps the calendar open after selecting a date range', () => {
    render(<TripSearchForm />)

    fireEvent.click(screen.getByRole('button', { name: /Когда/ }))
    fireEvent.click(
      screen.getByRole('button', {
        name: '5 ноября 2026',
      }),
    )

    expect(screen.getByRole('button', { name: /Когда/ })).toHaveTextContent('5 ноября')
    expect(screen.getByRole('dialog', { name: 'Выбор даты' })).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: '8 ноября 2026',
      }),
    )

    expect(screen.getByRole('button', { name: /Обратно/ })).toHaveTextContent('8 ноября')
    expect(screen.queryByRole('dialog', { name: 'Выбор даты' })).toBeInTheDocument()
  })

  it('keeps the calendar open after selecting a one-way date', () => {
    render(<TripSearchForm />)

    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Билет в одну сторону',
      }),
    )
    fireEvent.click(screen.getByRole('button', { name: /Когда/ }))
    fireEvent.click(
      screen.getByRole('button', {
        name: '5 ноября 2026',
      }),
    )

    expect(screen.queryByRole('dialog', { name: 'Выбор даты' })).toBeInTheDocument()
  })
  it('opens the passenger selector and closes the calendar', () => {
    render(<TripSearchForm />)

    fireEvent.click(screen.getByRole('button', { name: /Когда/ }))

    expect(screen.getByRole('dialog', { name: 'Выбор даты' })).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: /Пассажиры и класс/,
      }),
    )

    expect(screen.queryByRole('dialog', { name: 'Выбор даты' })).not.toBeInTheDocument()

    expect(
      screen.getByRole('dialog', {
        name: 'Выбор пассажиров и класса',
      }),
    ).toBeInTheDocument()
  })
  it('updates the passenger summary', () => {
    render(<TripSearchForm />)

    fireEvent.click(
      screen.getByRole('button', {
        name: /Пассажиры и класс/,
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Увеличить количество взрослых',
      }),
    )

    expect(
      screen.getByRole('button', {
        name: /3 пассажира, эконом/,
      }),
    ).toBeInTheDocument()
  })
  it('updates the class in the passenger summary', () => {
    render(<TripSearchForm />)

    fireEvent.click(
      screen.getByRole('button', {
        name: /Пассажиры и класс/,
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Бизнес',
      }),
    )

    expect(
      screen.getByRole('button', {
        name: /2 пассажира, бизнес/,
      }),
    ).toBeInTheDocument()
  })

  it('starts the flight search after submitting the form', () => {
    const onSearch = vi.fn()

    render(<TripSearchForm onSearch={onSearch} />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Найти билеты',
      }),
    )

    expect(onSearch).toHaveBeenCalledOnce()
  })
})
