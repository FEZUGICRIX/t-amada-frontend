import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HotelFiltersPanel from './HotelFiltersPanel'
import { defaultHotelFilters, type HotelFilters } from './hotelFilters'

function Harness() {
  const [filters, setFilters] = useState<HotelFilters>(defaultHotelFilters)
  const [open, setOpen] = useState(true)
  return open ? (
    <HotelFiltersPanel
      filters={filters}
      onChange={setFilters}
      onReset={() => setFilters(defaultHotelFilters)}
      onClose={() => setOpen(false)}
    />
  ) : (
    <p>Закрыто</p>
  )
}

describe('hotel filter panel', () => {
  it('updates selections, resets, and closes with Escape', () => {
    render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: 'Завтрак включён' }))
    expect(screen.getByRole('button', { name: 'Завтрак включён' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    fireEvent.change(screen.getByRole('textbox', { name: 'Цена от' }), {
      target: { value: '50000' },
    })
    expect(screen.getByRole('textbox', { name: 'Цена от' })).toHaveValue('50 000 ₽')
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить' }))
    expect(screen.getByRole('button', { name: 'Завтрак включён' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByText('Закрыто')).toBeInTheDocument()
  })
})
