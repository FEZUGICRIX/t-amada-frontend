import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import InsurancePage from './InsurancePage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}))

describe('Страница страховки', () => {
  beforeEach(() => sessionStorage.clear())
  it('показывает заголовок и варианты', () => {
    render(<InsurancePage />)
    expect(screen.getByRole('heading', { name: 'Выберите страховку' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Базовая защита' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Расширенная защита' })).toBeInTheDocument()
  })
  it('учитывает выбранный номер и перелёт', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({ isOneWay: true, passengers: { adults: 2, children: 0 } }),
    )
    sessionStorage.setItem(
      'selected-flights',
      JSON.stringify({ outbound: 'aeroflot-1', return: null }),
    )
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({ hotelId: 'sea-galaxy', roomId: 'standard-single' }),
    )
    render(<InsurancePage />)
    expect(screen.getByLabelText('Ваша поездка')).toHaveTextContent('68 680 ₽')
    expect(screen.getByLabelText('Ваша поездка')).toHaveTextContent('Sea Galaxy')
  })
})
