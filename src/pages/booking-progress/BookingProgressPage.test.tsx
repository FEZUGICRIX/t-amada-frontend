import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import BookingProgressPage from './BookingProgressPage'
const navigate = vi.hoisted(() => vi.fn())
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))
describe('Процесс бронирования', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-12-01T10:00:00Z'))
  })
  afterEach(() => vi.useRealTimers())
  it('показывает только выбранные услуги и последовательно обновляет статусы', () => {
    sessionStorage.setItem(
      'demo-booking',
      JSON.stringify({
        total: 4000,
        startedAt: Date.now(),
        services: [
          { id: 'flight', name: 'Авиабилет', price: 2000 },
          { id: 'insurance', name: 'Страховка', price: 1333 },
        ],
      }),
    )
    render(<BookingProgressPage />)
    expect(screen.getAllByText('Шаг 1 из 2').length).toBeGreaterThan(0)
    expect(screen.getByText('Подтверждаем')).toBeInTheDocument()
    expect(screen.getByText('Ожидает')).toBeInTheDocument()
    expect(screen.queryByText('Отель')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(3000))
    expect(screen.getAllByText('Шаг 2 из 2').length).toBeGreaterThan(0)
    expect(screen.getByText('Подтверждён')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(3000))
    expect(navigate).toHaveBeenCalledWith({ to: '/booking/success', replace: true })
  })
  it('предлагает вернуться к проверке при отсутствии заказа', () => {
    render(<BookingProgressPage />)
    expect(screen.getByText('Заказ не найден')).toBeInTheDocument()
    expect(screen.getByText('К проверке поездки')).toBeInTheDocument()
  })
})
