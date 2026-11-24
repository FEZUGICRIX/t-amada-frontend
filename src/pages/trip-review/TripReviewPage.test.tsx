import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import TripReviewPage from './TripReviewPage'

const navigate = vi.hoisted(() => vi.fn())
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}))

describe('Проверка поездки', () => {
  beforeEach(() => {
    sessionStorage.clear()
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        departureDate: '2026-12-01',
        returnDate: '2026-12-03',
        isOneWay: false,
        passengers: { adults: 2, children: 0, infants: 0 },
      }),
    )
    sessionStorage.setItem(
      'selected-flights',
      JSON.stringify({ outbound: 'aeroflot-1', return: null }),
    )
  })
  it('показывает только выбранные услуги и включает сбор в итог', () => {
    render(<TripReviewPage />)
    expect(screen.getByRole('heading', { name: 'Авиабилеты' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Отель' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Страховка' })).not.toBeInTheDocument()
    expect(screen.getByText('Сервисный сбор')).toBeInTheDocument()
    expect(screen.getByText('167 ₽')).toBeInTheDocument()
    expect(screen.getAllByText('25 047 ₽').length).toBeGreaterThan(0)
  })
  it('показывает выбранный отель с количеством номеров и страховку', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({
        hotelId: 'sea-galaxy',
        rooms: [{ roomId: 'standard-double', quantity: 2 }],
      }),
    )
    sessionStorage.setItem('selected-insurance', 'basic')
    render(<TripReviewPage />)
    const hotel = screen.getByRole('heading', { name: 'Отель' }).closest('article')!
    expect(within(hotel).getByText(/Стандарт двухместный · 2 шт/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Страховка' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Трансфер' })).not.toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Продолжить' })[0])
    expect(navigate).toHaveBeenCalledWith({ to: '/booking' })
  })
  it('показывает выбранный трансфер в оба конца и пересчитывает стоимость', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({
        hotelId: 'sea-galaxy',
        rooms: [{ roomId: 'standard-double', quantity: 1 }],
      }),
    )
    sessionStorage.setItem(
      'selected-transfer',
      JSON.stringify({
        optionId: 'standard',
        hotelId: 'sea-galaxy',
        roundTrip: true,
        flightKey: JSON.stringify(['aeroflot-1', null, '2026-12-01', '2026-12-03']),
      }),
    )
    sessionStorage.setItem(
      'transfer-schedule',
      JSON.stringify({
        hotelId: 'sea-galaxy',
        outboundFlight: 'aeroflot-1',
        departureDate: '2026-12-01',
        flightReturnDate: '2026-12-03',
        outboundDate: '2026-12-01',
        outboundTime: '17:00',
        returnDate: '2026-12-03',
        returnTime: '10:30',
      }),
    )
    const view = render(<TripReviewPage />)
    const transfer = screen.getByRole('heading', { name: 'Трансфер' }).closest('article')!
    expect(within(transfer).getByText(/17:00/)).toBeInTheDocument()
    expect(within(transfer).getByText(/10:30/)).toBeInTheDocument()
    expect(screen.getAllByText('2 400 ₽').length).toBeGreaterThan(0)
    view.unmount()
    sessionStorage.setItem(
      'selected-transfer',
      JSON.stringify({
        optionId: 'standard',
        hotelId: 'sea-galaxy',
        roundTrip: false,
        flightKey: JSON.stringify(['aeroflot-1', null, '2026-12-01', '2026-12-03']),
      }),
    )
    render(<TripReviewPage />)
    expect(
      within(screen.getByRole('heading', { name: 'Трансфер' }).closest('article')!).queryByText(
        /10:30/,
      ),
    ).not.toBeInTheDocument()
  })
  it('не показывает итоговую сумму при отсутствии дат проживания', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        departureDate: '2026-12-01',
        isOneWay: true,
        passengers: { adults: 2, children: 0, infants: 0 },
      }),
    )
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({
        hotelId: 'sea-galaxy',
        rooms: [{ roomId: 'standard-double', quantity: 1 }],
      }),
    )
    render(<TripReviewPage />)
    expect(screen.getAllByText('Укажите даты').length).toBeGreaterThan(0)
  })
  it('ведёт к изменению услуг и перечитывает данные после возвращения', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({
        hotelId: 'sea-galaxy',
        rooms: [{ roomId: 'standard-double', quantity: 1 }],
      }),
    )
    sessionStorage.setItem('selected-insurance', 'basic')
    const view = render(<TripReviewPage />)
    const hotel = screen.getByRole('heading', { name: 'Отель' }).closest('article')!
    expect(within(hotel).getByRole('link', { name: 'Изменить' })).toHaveAttribute('href', '/hotels')
    expect(
      within(screen.getByRole('heading', { name: 'Авиабилеты' }).closest('article')!).getByRole(
        'link',
        { name: 'Изменить' },
      ),
    ).toHaveAttribute('href', '/flights')
    view.unmount()
    sessionStorage.removeItem('selected-room')
    sessionStorage.removeItem('selected-insurance')
    render(<TripReviewPage />)
    expect(screen.queryByRole('heading', { name: 'Отель' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Страховка' })).not.toBeInTheDocument()
    expect(screen.getAllByText('25 047 ₽').length).toBeGreaterThan(0)
  })
})
