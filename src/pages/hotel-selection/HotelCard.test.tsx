import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import HotelCard from './HotelCard'
import { hotels } from './hotels'

describe('HotelCard', () => {
  it('показывает отель и его удобства', () => {
    const onSelect = vi.fn()
    render(<HotelCard hotel={hotels[0]} onSelect={onSelect} />)
    expect(screen.getByRole('heading', { name: hotels[0].name })).toBeInTheDocument()
    expect(screen.getByText(/4 звезды/)).toBeInTheDocument()
    expect(screen.getByText(/Бассейн/)).toBeInTheDocument()
    expect(screen.getByText('от 43 800 ₽')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Выбрать' }))
    expect(onSelect).toHaveBeenCalledWith(hotels[0])
  })
})
