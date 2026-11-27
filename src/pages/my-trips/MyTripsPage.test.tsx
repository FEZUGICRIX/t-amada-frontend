import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  getBookingStatus,
  readBookings,
  saveBooking,
  type DemoBooking,
} from '@/pages/booking-progress/bookingData'
import MyTripsPage from './MyTripsPage'
import { clearDraft, readDraft, restoreDraft, saveDraft } from './tripDraft'

const booking = (startedAt: number, failedServiceId?: string): DemoBooking => ({
  startedAt,
  total: 25000,
  services: [
    { id: 'flight', name: 'Авиабилет', price: 25000 },
    { id: 'hotel', name: 'Отель', price: 0 },
  ],
  trip: {
    origin: 'Москва',
    destination: 'Сочи',
    departureDate: '2026-12-01',
    returnDate: null,
    passengers: 2,
  },
  failedServiceId,
})

describe('Мои поездки', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  it('показывает пустое состояние', () => {
    render(<MyTripsPage />)
    expect(screen.getByText('Здесь пока нет поездок')).toBeInTheDocument()
  })
  it('сохраняет разные поездки и определяет их статусы', () => {
    const now = Date.now()
    const pending = booking(now)
    const success = booking(now - 20000)
    const cancelled = booking(now - 40000, 'hotel')
    for (const item of [pending, success, cancelled]) saveBooking(item)
    expect(readBookings()).toHaveLength(3)
    expect(getBookingStatus(pending, now)).toBe('pending')
    expect(getBookingStatus(success, now)).toBe('success')
    expect(getBookingStatus(cancelled, now)).toBe('cancelled')
    render(<MyTripsPage />)
    expect(screen.getByText('Бронируем')).toBeInTheDocument()
    expect(screen.getByText('Забронирована')).toBeInTheDocument()
    expect(screen.getByText('Отменена')).toBeInTheDocument()
    const card = screen.getByText('Отменена').closest('article')!
    const link = within(card).getByRole('link', { name: 'Открыть' })
    expect(link).toHaveAttribute('href', '/booking/cancelled')
    fireEvent.click(link, { button: 1 })
    expect(JSON.parse(sessionStorage.getItem('demo-booking')!).startedAt).toBe(cancelled.startedAt)
  })
  it('добавляет текущее бронирование в историю', () => {
    const current = booking(Date.now())
    sessionStorage.setItem('demo-booking', JSON.stringify(current))
    render(<MyTripsPage />)
    expect(screen.getByText('Москва → Сочи')).toBeInTheDocument()
    expect(readBookings()).toHaveLength(1)
  })
  it('сохраняет планируемую поездку и возвращает выбор на нужный этап', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ origin: 'Москва', destination: 'Сочи', departureDate: '2026-12-01' }),
    )
    sessionStorage.setItem('selected-flights', JSON.stringify({ outbound: 'flight-1' }))
    sessionStorage.setItem('passenger-details', 'личные данные')
    saveDraft('/hotels')
    sessionStorage.removeItem('selected-flights')
    const draft = readDraft()!
    expect(JSON.stringify(draft)).not.toContain('личные данные')
    render(<MyTripsPage />)
    expect(screen.getByText('Планируется')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Продолжить оформление' })).toHaveAttribute(
      'href',
      '/hotels',
    )
    restoreDraft(draft)
    expect(sessionStorage.getItem('selected-flights')).toContain('flight-1')
    clearDraft()
    expect(readDraft()).toBeNull()
  })
})
