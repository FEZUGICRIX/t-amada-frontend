import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import RoomCard from './RoomCard'
import { rooms } from './rooms'

describe('Карточка номера', () => {
  it('показывает данные номера и передаёт его при выборе', () => {
    const onChange = vi.fn()
    render(<RoomCard room={rooms[0]} quantity={0} onChange={onChange} />)
    expect(screen.getByRole('heading', { name: 'Стандарт одноместный' })).toBeInTheDocument()
    expect(screen.getByText('15 000 ₽')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Выбрать' }))
    expect(onChange).toHaveBeenCalledWith(rooms[0], 1)
  })
})
