import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import HotelRoomsPage from './HotelRoomsPage'

const route = vi.hoisted(() => ({ hotelId: 'sea-galaxy' }))
vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ hotelId: route.hotelId }),
  Link: ({ children }: { children: ReactNode }) => <a href="/hotels">{children}</a>,
}))

describe('Выбор номера', () => {
  beforeEach(() => {
    sessionStorage.clear()
    route.hotelId = 'sea-galaxy'
  })

  it('не переносит номера и трансфер при выборе другого отеля', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({ hotelId: 'pullman', rooms: [{ roomId: 'standard-double', quantity: 2 }] }),
    )
    sessionStorage.setItem('selected-transfer', JSON.stringify({ optionId: 'standard' }))
    render(<HotelRoomsPage />)
    expect(screen.queryByLabelText('Количество: Стандарт двухместный')).not.toBeInTheDocument()
    fireEvent.click(
      within(screen.getByRole('article', { name: 'Стандарт одноместный' })).getByRole('button', {
        name: 'Выбрать',
      }),
    )
    expect(JSON.parse(sessionStorage.getItem('selected-room') || 'null')).toEqual({
      hotelId: 'sea-galaxy',
      rooms: [{ roomId: 'standard-single', quantity: 1 }],
    })
    expect(sessionStorage.getItem('selected-transfer')).toBeNull()
  })
  it('фильтрует номера и сбрасывает пустой результат', () => {
    render(<HotelRoomsPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Одноместный' }))
    fireEvent.click(screen.getByRole('button', { name: 'Люкс' }))
    expect(screen.getByText('Номера не найдены')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить фильтры' }))
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })
  it('считает несколько типов номеров и позволяет уменьшать и удалять их', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ isOneWay: true, passengers: { adults: 2, children: 1, infants: 1 } }),
    )
    sessionStorage.setItem(
      'hotel-period',
      JSON.stringify({ start: '2026-12-01', end: '2026-12-04' }),
    )
    const { unmount } = render(<HotelRoomsPage />)
    fireEvent.click(
      within(screen.getByRole('article', { name: 'Стандарт двухместный' })).getByRole('button', {
        name: 'Выбрать',
      }),
    )
    expect(screen.getByRole('alert')).toHaveTextContent('выбрано 2 из 4')
    fireEvent.click(
      within(screen.getByRole('article', { name: 'Люкс двухместный' })).getByRole('button', {
        name: 'Выбрать',
      }),
    )
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeEnabled()
    expect(screen.getByLabelText('Выбранный номер')).toHaveTextContent('361 800 ₽')
    expect(screen.getByLabelText('Выбранный номер')).toHaveTextContent(
      '52 800 ₽ × 1 × 3 ноч. = 158 400 ₽',
    )
    unmount()
    render(<HotelRoomsPage />)
    expect(screen.getByLabelText('Количество: Стандарт двухместный')).toHaveTextContent('1')
    expect(screen.getByLabelText('Количество: Люкс двухместный')).toHaveTextContent('1')
    fireEvent.click(screen.getByRole('button', { name: 'Увеличить количество: Люкс двухместный' }))
    expect(screen.getByLabelText('Выбранный номер')).toHaveTextContent('565 200 ₽')
    fireEvent.click(screen.getByRole('button', { name: 'Уменьшить количество: Люкс двухместный' }))
    fireEvent.click(screen.getByRole('button', { name: 'Уменьшить количество: Люкс двухместный' }))
    expect(screen.queryByLabelText('Количество: Люкс двухместный')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
    fireEvent.click(
      screen.getByRole('button', { name: 'Уменьшить количество: Стандарт двухместный' }),
    )
    expect(sessionStorage.getItem('selected-room')).toBeNull()
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
    sessionStorage.setItem(
      'hotel-period',
      JSON.stringify({ start: '2026-12-01', end: '2026-12-03' }),
    )
    const { unmount } = render(<HotelRoomsPage />)
    fireEvent.click(
      within(screen.getByRole('article', { name: 'Стандарт одноместный' })).getByRole('button', {
        name: 'Выбрать',
      }),
    )
    expect(screen.getByLabelText('Выбранный номер')).toHaveTextContent('112 480 ₽')
    expect(screen.getByLabelText('Выбранный номер')).toHaveTextContent(
      '43 800 ₽ × 1 × 2 ноч. = 87 600 ₽',
    )
    expect(screen.getByRole('article', { name: 'Стандарт одноместный' })).toHaveTextContent(
      '87 600 ₽ за проживание',
    )
    unmount()
    render(<HotelRoomsPage />)
    expect(screen.getByLabelText('Количество: Стандарт одноместный')).toHaveTextContent('1')
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
    expect(screen.getByRole('alert')).toHaveTextContent('Недостаточно мест')
    fireEvent.click(
      screen.getByRole('button', { name: 'Увеличить количество: Стандарт одноместный' }),
    )
    expect(screen.getByLabelText('Выбранный номер')).toHaveTextContent('200 080 ₽')
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(screen.getByRole('status')).toHaveTextContent('Следующий этап пока недоступен')
  })
})
