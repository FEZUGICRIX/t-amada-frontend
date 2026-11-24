import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import BookingCancelledPage from './BookingCancelledPage'
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}))
const services = [
  { id: 'flight', name: 'Авиабилет', price: 2000 },
  { id: 'hotel', name: 'Отель', price: 3000 },
  { id: 'insurance', name: 'Страховка', price: 500 },
]
describe('Отмена бронирования', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-12-01T10:00:20Z'))
  })
  afterEach(() => vi.useRealTimers())
  it('показывает причину и статусы услуг при отказе отеля', () => {
    sessionStorage.setItem(
      'demo-booking',
      JSON.stringify({
        startedAt: Date.now() - 10000,
        total: 6167,
        services,
        failedServiceId: 'hotel',
        paymentStatus: 'not_charged',
      }),
    )
    render(<BookingCancelledPage />)
    expect(screen.getByRole('heading', { name: 'Заказ отменён' })).toBeInTheDocument()
    expect(screen.getAllByText('Отель не подтвердил бронирование').length).toBeGreaterThan(0)
    expect(screen.getByText('Отменён')).toBeInTheDocument()
    expect(screen.getByText('Не подтверждён')).toBeInTheDocument()
    expect(screen.getByText('Не оформлена')).toBeInTheDocument()
    expect(screen.getByText('Списание не выполнено')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Собрать заново' })).toHaveAttribute('href', '/')
  })
  it('показывает отказ первой услуги и не утверждает статус оплаты без данных', () => {
    sessionStorage.setItem(
      'demo-booking',
      JSON.stringify({
        startedAt: Date.now() - 10000,
        total: 2000,
        services: services.slice(0, 1),
        failedServiceId: 'flight',
      }),
    )
    render(<BookingCancelledPage />)
    expect(screen.getByText('Не подтверждён')).toBeInTheDocument()
    expect(screen.queryByText('Списание не выполнено')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Отель' })).not.toBeInTheDocument()
  })
  it('не показывает отмену до завершения отказавшего шага', () => {
    sessionStorage.setItem(
      'demo-booking',
      JSON.stringify({ startedAt: Date.now(), total: 2000, services, failedServiceId: 'hotel' }),
    )
    render(<BookingCancelledPage />)
    expect(screen.getByText('Бронирование ещё не завершено')).toBeInTheDocument()
  })
  it('не показывает отмену без отказа', () => {
    sessionStorage.setItem(
      'demo-booking',
      JSON.stringify({ startedAt: Date.now() - 10000, total: 2000, services }),
    )
    render(<BookingCancelledPage />)
    expect(screen.getByText('Отменённый заказ не найден')).toBeInTheDocument()
  })
})
