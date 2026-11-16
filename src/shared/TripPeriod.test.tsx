import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import TripPeriodPicker from './TripPeriod'
import { getNights, readTripPeriod, type TripPeriod } from './tripPeriodData'

function Example({ minimumNights = 0 }: { minimumNights?: number }) {
  const [period, setPeriod] = useState<TripPeriod>({ start: null, end: null })
  return (
    <TripPeriodPicker
      label="Даты страховки"
      period={period}
      onChange={setPeriod}
      minimumNights={minimumNights}
    />
  )
}

describe('Период поездки', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 1))
  })
  afterEach(() => vi.useRealTimers())
  it('позволяет выбрать даты и не допускает окончание раньше начала', () => {
    render(<Example />)
    expect(screen.getByRole('group', { name: 'Выбор даты' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Окончание: Выберите дату' })).toBeDisabled()
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Выбор даты' })).getByRole('button', {
        name: '12 октября 2026',
      }),
    )
    expect(
      within(screen.getByRole('group', { name: 'Выбор даты' })).getByRole('button', {
        name: '11 октября 2026',
      }),
    ).toBeDisabled()
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Выбор даты' })).getByRole('button', {
        name: '18 октября 2026',
      }),
    )
    expect(screen.getByRole('button', { name: /Начало: 12 октября/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Окончание: 18 октября/ })).toBeInTheDocument()
  })
  it('сохраняет цвет выбранного заезда при выборе выезда', () => {
    render(<Example minimumNights={1} />)
    const calendar = screen.getByRole('group', { name: 'Выбор даты' })
    fireEvent.click(within(calendar).getByRole('button', { name: '12 октября 2026' }))
    const start = within(calendar).getByRole('button', { name: '12 октября 2026' })
    expect(start).toBeDisabled()
    expect(start).toHaveAttribute('aria-pressed', 'true')
    expect(start).toHaveClass('disabled:text-text-primary')
    expect(within(calendar).getByRole('button', { name: '11 октября 2026' })).toHaveClass(
      'disabled:text-[#c7cdd4]',
    )
  })
  it('берёт даты перелёта туда и обратно и отдельно хранит ручные периоды', () => {
    const roundTrip = { isOneWay: false, departureDate: '2026-10-12', returnDate: '2026-10-18' }
    sessionStorage.setItem(
      'hotel-period',
      JSON.stringify({ start: '2026-10-13', end: '2026-10-19' }),
    )
    expect(readTripPeriod('hotel-period', roundTrip)).toEqual({
      start: '2026-10-12',
      end: '2026-10-18',
    })
    expect(readTripPeriod('hotel-period', { isOneWay: true })).toEqual({
      start: '2026-10-13',
      end: '2026-10-19',
    })
    expect(readTripPeriod('insurance-period', { isOneWay: true })).toEqual({
      start: null,
      end: null,
    })
  })
  it('считает ночи между датами и не принимает выезд в день заезда', () => {
    expect(getNights({ start: '2026-12-30', end: '2027-01-02' })).toBe(3)
    expect(getNights({ start: '2026-12-30', end: '2026-12-30' })).toBeNull()
    expect(getNights({ start: '2026-12-30', end: null })).toBeNull()
  })
})
