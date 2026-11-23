import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import PassengerDetailsPage from './PassengerDetailsPage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}))

describe('Данные пассажиров', () => {
  beforeEach(() => sessionStorage.clear())
  it('показывает пустые поля для каждого пассажира и контакты покупателя', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ passengers: { adults: 2, children: 1, infants: 1 } }),
    )
    render(<PassengerDetailsPage />)
    expect(screen.getByRole('heading', { name: 'Данные пассажиров' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Пассажир 1 · взрослый' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Пассажир 2 · взрослый' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Пассажир 3 · ребёнок' })).toBeInTheDocument()
    const infant = screen.getByRole('group', { name: 'Пассажир 4 · младенец' })
    expect(within(infant).getByLabelText('Фамилия')).toHaveValue('')
    fireEvent.change(within(infant).getByLabelText('Фамилия'), { target: { value: 'Иванов' } })
    expect(within(infant).getByLabelText('Фамилия')).toHaveValue('Иванов')
    expect(
      within(screen.getByRole('group', { name: 'Пассажир 1 · взрослый' })).getByLabelText(
        'Фамилия',
      ),
    ).toHaveValue('')
    expect(screen.getByLabelText('Телефон')).toHaveValue('')
    expect(screen.getByLabelText('Электронная почта')).toHaveValue('')
    expect(screen.getByRole('link', { name: 'Назад' })).toHaveAttribute('href', '/insurance')
  })
  it('показывает всех десятерых пассажиров, выбранных на первом экране', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ passengers: { adults: 10, children: 0, infants: 0 } }),
    )
    render(<PassengerDetailsPage />)
    expect(screen.getByRole('group', { name: 'Пассажир 10 · взрослый' })).toBeInTheDocument()
  })
  it('возвращает к трансферу при выбранном отеле и показывает состояние недоступного этапа', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({
        hotelId: 'sea-galaxy',
        rooms: [{ roomId: 'standard-double', quantity: 1 }],
      }),
    )
    render(<PassengerDetailsPage />)
    expect(screen.getByRole('link', { name: 'Назад' })).toHaveAttribute('href', '/transfer')
    fireEvent.click(screen.getByRole('button', { name: 'Перейти к проверке' }))
    expect(screen.getByRole('status')).toHaveTextContent('Следующий этап пока недоступен')
  })
})
