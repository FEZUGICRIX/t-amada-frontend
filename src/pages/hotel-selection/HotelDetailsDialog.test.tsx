import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import HotelDetailsDialog from './HotelDetailsDialog'
import { hotels } from './hotels'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, params }: { children: ReactNode; params: { hotelId: string } }) => (
    <a href={`/hotels/${params.hotelId}/rooms`}>{children}</a>
  ),
}))

describe('HotelDetailsDialog', () => {
  it('shows details and a link for the selected hotel', () => {
    render(<HotelDetailsDialog hotel={hotels[0]} onClose={() => undefined} />)
    expect(screen.getByRole('dialog')).toHaveAccessibleName(hotels[0].name)
    expect(screen.getByText(/4 звезды/)).toBeInTheDocument()
    expect(screen.getByText('Бассейн')).toBeInTheDocument()
    expect(screen.getByText(hotels[0].details)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Выбрать номер' })).toHaveAttribute(
      'href',
      '/hotels/sea-galaxy/rooms',
    )
  })
  it('closes with Escape and by button', () => {
    const onClose = vi.fn()
    render(<HotelDetailsDialog hotel={hotels[0]} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть описание отеля' }))
    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
