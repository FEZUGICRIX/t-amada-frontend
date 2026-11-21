import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import TransferPage from './TransferPage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}))

describe('Экран трансфера', () => {
  beforeEach(() => sessionStorage.clear())

  it('не подставляет выдуманные отель и даты при отсутствии поездки', () => {
    render(<TransferPage />)
    expect(screen.getByRole('heading', { name: 'Выберите трансфер' })).toBeInTheDocument()
    expect(screen.getByLabelText('Маршрут трансфера')).toHaveTextContent('Отель не выбран')
    expect(screen.getByLabelText('Маршрут трансфера')).toHaveTextContent('Дата не выбрана')
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
    expect(screen.getByRole('link', { name: 'Назад' })).toHaveAttribute('href', '/insurance')
  })

  it('показывает выбранный отель, аэропорт и даты рейсов', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({ hotelId: 'pullman', roomId: 'standard-single' }),
    )
    sessionStorage.setItem(
      'selected-flights',
      JSON.stringify({ outbound: 'aeroflot-1', return: 'aeroflot-return' }),
    )
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        departureDate: '2026-12-01',
        returnDate: '2026-12-07',
        passengers: { adults: 2, children: 0, infants: 0 },
      }),
    )
    render(<TransferPage />)
    const route = screen.getByLabelText('Маршрут трансфера')
    expect(route).toHaveTextContent('Аэропорт Сочи, AER → Pullman Sochi Centre')
    expect(route).toHaveTextContent('Прилёт: 1 декабря, 14:05')
    expect(route).not.toHaveTextContent('Обратный вылет')
    fireEvent.click(screen.getByRole('button', { name: 'Из аэропорта и обратно' }))
    expect(route).toHaveTextContent('Pullman Sochi Centre → Аэропорт Сочи, AER')
    expect(route).toHaveTextContent('Обратный вылет: 7 декабря')
  })

  it('переключает тариф по карточке и кнопке и показывает цену за поездку', () => {
    render(<TransferPage />)
    const standard = screen.getByRole('article', { name: 'Стандарт' })
    fireEvent.click(standard)
    expect(within(standard).getByRole('button', { name: 'Выбрано' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(standard).getByText('1 200 ₽')).toBeInTheDocument()
    expect(within(standard).getByText('за поездку')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Из аэропорта и обратно' }))
    expect(standard).toHaveTextContent('2 400 ₽ туда и обратно')
    const minivan = screen.getByRole('article', { name: 'Минивэн' })
    fireEvent.click(within(minivan).getByRole('button', { name: 'Выбрать' }))
    expect(within(standard).getByRole('button', { name: 'Выбрать' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(minivan).toHaveTextContent('3 800 ₽ туда и обратно')
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: 'Пропустить этап' }))
    expect(within(minivan).getByRole('button', { name: 'Выбрать' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
  })
})
