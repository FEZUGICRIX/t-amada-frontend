import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import BookingSteps from './BookingSteps'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}))

describe('Этапы бронирования', () => {
  beforeEach(() => sessionStorage.clear())
  it('не открывает этапы без билета даже при сохранённом отеле', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({ hotelId: 'pullman', roomId: 'standard-single' }),
    )
    render(<BookingSteps current={0} />)
    expect(screen.queryByRole('link', { name: '2. Отель' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '3. Страховка' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '4. Трансфер' })).not.toBeInTheDocument()
  })
  it('открывает отели и страховку для билета в одну сторону без отеля', () => {
    sessionStorage.setItem('trip-search', JSON.stringify({ isOneWay: true }))
    sessionStorage.setItem('selected-flights', JSON.stringify({ outbound: 'aeroflot-1' }))
    render(<BookingSteps current={0} />)
    expect(screen.getByRole('link', { name: '2. Отель' })).toHaveAttribute('href', '/hotels')
    expect(screen.getByRole('link', { name: '3. Страховка' })).toHaveAttribute('href', '/insurance')
    expect(screen.queryByText('4. Трансфер')).not.toBeInTheDocument()
  })
  it('требует оба рейса для поездки туда и обратно', () => {
    sessionStorage.setItem('trip-search', JSON.stringify({ isOneWay: false }))
    sessionStorage.setItem('selected-flights', JSON.stringify({ outbound: 'aeroflot-1' }))
    const { rerender } = render(<BookingSteps current={0} />)
    expect(screen.queryByRole('link', { name: '3. Страховка' })).not.toBeInTheDocument()
    sessionStorage.setItem(
      'selected-flights',
      JSON.stringify({ outbound: 'aeroflot-1', return: 'return-aeroflot-1' }),
    )
    rerender(<BookingSteps current={0} />)
    expect(screen.getByRole('link', { name: '3. Страховка' })).toHaveAttribute('href', '/insurance')
  })
  it('разрешает переход ко всем этапам при выбранных билетах и отеле', () => {
    sessionStorage.setItem('trip-search', JSON.stringify({ isOneWay: true }))
    sessionStorage.setItem('selected-flights', JSON.stringify({ outbound: 'aeroflot-1' }))
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({ hotelId: 'pullman', roomId: 'standard-single' }),
    )
    render(<BookingSteps current={1} />)
    expect(screen.getByRole('link', { name: '1. Авиабилет' })).toHaveAttribute('href', '/flights')
    expect(screen.getByRole('link', { name: '3. Страховка' })).toHaveAttribute('href', '/insurance')
    expect(screen.getByRole('link', { name: '4. Трансфер' })).toHaveAttribute('href', '/transfer')
  })
  it('обновляет доступность сразу после выбора или снятия рейса', () => {
    const { rerender } = render(<BookingSteps current={0} flightsComplete={false} />)
    expect(screen.queryByRole('link', { name: '2. Отель' })).not.toBeInTheDocument()
    rerender(<BookingSteps current={0} flightsComplete />)
    expect(screen.getByRole('link', { name: '2. Отель' })).toBeInTheDocument()
    rerender(<BookingSteps current={0} flightsComplete={false} />)
    expect(screen.queryByRole('link', { name: '2. Отель' })).not.toBeInTheDocument()
  })
})
