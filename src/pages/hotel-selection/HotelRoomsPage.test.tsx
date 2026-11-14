import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import HotelRoomsPage from './HotelRoomsPage'

vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ hotelId: 'sea-galaxy' }),
  Link: ({ children }: { children: ReactNode }) => <a href="/hotels">{children}</a>,
}))

describe('Выбор номера', () => {
  beforeEach(() => sessionStorage.clear())
  it('фильтрует номера и сбрасывает пустой результат', () => {
    render(<HotelRoomsPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Одноместный' }))
    fireEvent.click(screen.getByRole('button', { name: 'Люкс' }))
    expect(screen.getByText('Номера не найдены')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить фильтры' }))
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })
  it('сохраняет выбор и считает итог с перелётом', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ isOneWay: true, passengers: { adults: 2, children: 0 } }),
    )
    sessionStorage.setItem(
      'selected-flights',
      JSON.stringify({ outbound: 'aeroflot-1', return: null }),
    )
    const { unmount } = render(<HotelRoomsPage />)
    fireEvent.click(
      within(screen.getByRole('article', { name: 'Стандарт одноместный' })).getByRole('button', {
        name: 'Выбрать',
      }),
    )
    expect(screen.getByLabelText('Выбранный номер')).toHaveTextContent('68 680 ₽')
    unmount()
    render(<HotelRoomsPage />)
    expect(
      within(screen.getByRole('article', { name: 'Стандарт одноместный' })).getByRole('button', {
        name: 'Выбрано',
      }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(screen.getByRole('status')).toHaveTextContent('Следующий этап пока недоступен')
  })
})
