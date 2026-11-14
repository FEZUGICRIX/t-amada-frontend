import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import DatePicker from './DatePicker'

const defaultProps = {
  departureDate: null,
  returnDate: null,
  selectionMode: 'departure' as const,
  onSelect: vi.fn(),
}

describe('DatePicker', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 3))
    defaultProps.onSelect.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('показывает следующий месяц', () => {
    render(<DatePicker {...defaultProps} />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Следующий месяц',
      }),
    )

    expect(screen.getByText('Декабрь')).toBeInTheDocument()
  })

  it('не позволяет перейти к прошедшему месяцу', () => {
    render(<DatePicker {...defaultProps} />)

    expect(
      screen.getByRole('button', {
        name: 'Предыдущий месяц',
      }),
    ).toBeDisabled()
  })

  it('позволяет выбрать текущий год и пять следующих', () => {
    render(<DatePicker {...defaultProps} />)

    const yearSelect = screen.getByRole('combobox', {
      name: 'Выберите год',
    })

    expect(yearSelect).toHaveValue('2026')
    expect(screen.getAllByRole('option')).toHaveLength(6)

    fireEvent.change(yearSelect, {
      target: { value: '2031' },
    })

    expect(yearSelect).toHaveValue('2031')
  })

  it('делает прошедшие даты недоступными', () => {
    render(<DatePicker {...defaultProps} />)

    expect(
      screen.getByRole('button', {
        name: '2 ноября 2026',
      }),
    ).toBeDisabled()

    expect(
      screen.getByRole('button', {
        name: '3 ноября 2026',
      }),
    ).not.toBeDisabled()
  })

  it('делает даты до вылета недоступными для возвращения', () => {
    render(
      <DatePicker {...defaultProps} departureDate={new Date(2026, 10, 5)} selectionMode="return" />,
    )

    expect(
      screen.getByRole('button', {
        name: '4 ноября 2026',
      }),
    ).toBeDisabled()

    expect(
      screen.getByRole('button', {
        name: '5 ноября 2026',
      }),
    ).not.toBeDisabled()
  })

  it('возвращает выбранную дату', () => {
    const onSelect = vi.fn()

    render(<DatePicker {...defaultProps} onSelect={onSelect} />)

    fireEvent.click(
      screen.getByRole('button', {
        name: '5 ноября 2026',
      }),
    )

    expect(onSelect).toHaveBeenCalledWith(new Date(2026, 10, 5))
  })
})
