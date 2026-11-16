import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ComponentProps, ReactNode } from 'react'
import HotelSelectionPage from './HotelSelectionPage'

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }))
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigate,
  Link: ({
    children,
    onClick,
  }: {
    children: ReactNode
    onClick?: ComponentProps<'a'>['onClick']
  }) => (
    <a href="/hotels" onClick={onClick}>
      {children}
    </a>
  ),
}))

describe('Даты проживания', () => {
  beforeEach(() => {
    sessionStorage.clear()
    navigate.mockClear()
  })
  it('просит выбрать даты перед переходом к номерам при билете в одну сторону', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        destination: 'Сочи',
        isOneWay: true,
        passengers: { adults: 1, children: 0, infants: 0 },
      }),
    )
    render(<HotelSelectionPage />)
    fireEvent.click(screen.getByRole('article', { name: /Sea Galaxy/ }))
    const dialog = screen.getByRole('dialog')
    fireEvent.click(within(dialog).getByRole('link', { name: 'Выбрать номер' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Выберите начало и окончание периода')
  })
  it('пропускает отель, удаляет выбранный номер и сохраняет перелёт', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        destination: 'Сочи',
        isOneWay: true,
        passengers: { adults: 1, children: 0, infants: 0 },
      }),
    )
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({ hotelId: 'sea-galaxy', roomId: 'standard-single' }),
    )
    sessionStorage.setItem(
      'selected-flights',
      JSON.stringify({ outbound: 'aeroflot-1', return: null }),
    )
    render(<HotelSelectionPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Пропустить этап' }))
    expect(sessionStorage.getItem('selected-room')).toBeNull()
    expect(sessionStorage.getItem('selected-flights')).toContain('aeroflot-1')
    expect(navigate).toHaveBeenCalledWith({ to: '/insurance' })
  })
})
