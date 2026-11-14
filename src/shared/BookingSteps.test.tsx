import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import BookingSteps from './BookingSteps'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}))

describe('Этапы бронирования', () => {
  beforeEach(() => sessionStorage.clear())
  it('позволяет вернуться к отелю после выбора номера', () => {
    sessionStorage.setItem(
      'selected-room',
      JSON.stringify({ hotelId: 'pullman', roomId: 'standard-single' }),
    )
    render(<BookingSteps current={0} />)
    expect(screen.getByRole('link', { name: '2. Отель' })).toHaveAttribute('href', '/hotels')
  })
  it('не открывает будущий этап без выбранного номера', () => {
    render(<BookingSteps current={0} />)
    expect(screen.queryByRole('link', { name: '2. Отель' })).not.toBeInTheDocument()
  })
})
