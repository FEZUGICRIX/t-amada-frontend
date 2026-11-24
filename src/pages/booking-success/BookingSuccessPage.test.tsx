import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import BookingSuccessPage from './BookingSuccessPage'
import { outboundFlights } from '@/pages/flight-selection/mockFlights'
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}))
describe('Успешное бронирование', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-12-01T10:00:10Z'))
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute('open', '')
    }
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    }
  })
  afterEach(() => vi.useRealTimers())
  it('показывает только выбранные услуги и итог после завершения', () => {
    sessionStorage.setItem(
      'demo-booking',
      JSON.stringify({
        startedAt: Date.now() - 9000,
        total: 4667,
        trip: {
          origin: 'Москва',
          destination: 'Сочи',
          departureDate: '2026-12-01',
          returnDate: '2026-12-03',
          passengers: 2,
        },
        services: [
          { id: 'flight', name: 'Авиабилет', price: 2000 },
          { id: 'insurance', name: 'Страховка', price: 2000 },
        ],
      }),
    )
    render(<BookingSuccessPage />)
    expect(screen.getByRole('heading', { name: 'Поездка забронирована' })).toBeInTheDocument()
    expect(screen.getByText('Авиабилет')).toBeInTheDocument()
    expect(screen.getByText(/4 667 ₽/)).toBeInTheDocument()
    expect(screen.getAllByText(/2 человека/).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Готово')).toHaveLength(2)
    expect(screen.getByRole('link', { name: 'На главную' })).toHaveAttribute('href', '/')
    fireEvent.click(screen.getByRole('button', { name: 'Открыть поездку' }))
    expect(screen.getByRole('status')).toHaveTextContent('Раздел поездки пока недоступен')
  })
  it('показывает состав пассажиров, рейс с пересадкой и выбранные услуги из заказа', () => {
    sessionStorage.setItem(
      'demo-booking',
      JSON.stringify({
        startedAt: Date.now() - 20000,
        total: 4667,
        services: [
          { id: 'flight', name: 'Авиабилет', price: 2000 },
          { id: 'hotel', name: 'Отель', price: 2000 },
          { id: 'insurance', name: 'Страховка', price: 500 },
          { id: 'transfer', name: 'Трансфер', price: 500 },
        ],
        trip: {
          origin: 'Москва',
          destination: 'Сочи',
          departureDate: '2026-12-01',
          returnDate: null,
          passengers: 4,
          passengerCounts: { adults: 2, children: 1, infants: 1 },
          outbound: {
            ...outboundFlights[0],
            stops: [{ city: 'Казань', airport: 'KZN', duration: '2 ч' }],
          },
          hotelName: 'Sea Galaxy',
          insuranceName: 'Базовая защита',
          transferName: 'Стандарт',
          transferRoundTrip: false,
        },
      }),
    )
    render(<BookingSuccessPage />)
    expect(screen.getAllByText(/2 взрослых, 1 ребёнок/).length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('button', { name: 'Подробнее: Авиабилет' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Вылет · 1 декабря')).toBeInTheDocument()
    expect(within(dialog).getByText('10:20 · SVO')).toBeInTheDocument()
    expect(within(dialog).getByText('Прилёт · 1 декабря')).toBeInTheDocument()
    expect(within(dialog).getByText('14:05 · AER')).toBeInTheDocument()
    expect(within(dialog).getByText(/Казань · KZN · 2 ч/)).toBeInTheDocument()
    fireEvent.click(within(dialog).getAllByRole('button', { name: 'Закрыть' })[0])
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Подробнее: Отель' }))
    expect(within(screen.getByRole('dialog')).getByText('Sea Galaxy')).toBeInTheDocument()
    fireEvent.click(
      within(screen.getByRole('dialog')).getAllByRole('button', { name: 'Закрыть' })[0],
    )
    expect(screen.getByText(/Базовая защита/)).toBeInTheDocument()
    expect(screen.getByText(/Стандарт · в отель/)).toBeInTheDocument()
  })
  it('не показывает успешный результат до окончания', () => {
    sessionStorage.setItem(
      'demo-booking',
      JSON.stringify({
        startedAt: Date.now(),
        total: 2000,
        services: [{ id: 'flight', name: 'Авиабилет', price: 2000 }],
      }),
    )
    render(<BookingSuccessPage />)
    expect(screen.getByText('Бронирование ещё не завершено')).toBeInTheDocument()
  })
  it('показывает сообщение при отсутствии заказа', () => {
    render(<BookingSuccessPage />)
    expect(screen.getByText('Заказ не найден')).toBeInTheDocument()
  })
})
