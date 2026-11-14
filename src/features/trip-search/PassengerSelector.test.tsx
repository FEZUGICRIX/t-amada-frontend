import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import PassengerSelector from './PassengerSelector'

describe('PassengerSelector', () => {
  it('увеличивает количество взрослых', () => {
    const onChange = vi.fn()

    const value = {
      adults: 2,
      children: 0,
      infants: 0,
      travelClass: 'economy' as const,
    }

    render(<PassengerSelector value={value} onChange={onChange} />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Увеличить количество взрослых',
      }),
    )

    expect(onChange).toHaveBeenCalledWith({
      adults: 3,
      children: 0,
      infants: 0,
      travelClass: 'economy',
    })
  })
  it('не позволяет выбрать меньше одного взрослого', () => {
    const onChange = vi.fn()

    const value = {
      adults: 1,
      children: 0,
      infants: 0,
      travelClass: 'economy' as const,
    }

    render(<PassengerSelector value={value} onChange={onChange} />)

    const decrementButton = screen.getByRole('button', {
      name: 'Уменьшить количество взрослых',
    })

    expect(decrementButton).toBeDisabled()

    fireEvent.click(decrementButton)

    expect(onChange).not.toHaveBeenCalled()
  })
  it('не позволяет выбрать больше десяти пассажиров', () => {
    const onChange = vi.fn()

    const value = {
      adults: 8,
      children: 2,
      infants: 0,
      travelClass: 'economy' as const,
    }

    render(<PassengerSelector value={value} onChange={onChange} />)

    const incrementButton = screen.getByRole('button', {
      name: 'Увеличить количество взрослых',
    })

    expect(incrementButton).toBeDisabled()

    fireEvent.click(incrementButton)

    expect(onChange).not.toHaveBeenCalled()
  })
  it('увеличивает количество детей', () => {
    const onChange = vi.fn()

    const value = {
      adults: 2,
      children: 0,
      infants: 0,
      travelClass: 'economy' as const,
    }

    render(<PassengerSelector value={value} onChange={onChange} />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Увеличить количество детей',
      }),
    )

    expect(onChange).toHaveBeenCalledWith({
      adults: 2,
      children: 1,
      infants: 0,
      travelClass: 'economy',
    })
  })
  it('не позволяет выбрать отрицательное количество детей', () => {
    const onChange = vi.fn()

    const value = {
      adults: 2,
      children: 0,
      infants: 0,
      travelClass: 'economy' as const,
    }

    render(<PassengerSelector value={value} onChange={onChange} />)

    const decrementButton = screen.getByRole('button', {
      name: 'Уменьшить количество детей',
    })

    expect(decrementButton).toBeDisabled()

    fireEvent.click(decrementButton)

    expect(onChange).not.toHaveBeenCalled()
  })
  it('увеличивает количество младенцев', () => {
    const onChange = vi.fn()

    const value = {
      adults: 2,
      children: 0,
      infants: 0,
      travelClass: 'economy' as const,
    }

    render(<PassengerSelector value={value} onChange={onChange} />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Увеличить количество младенцев',
      }),
    )

    expect(onChange).toHaveBeenCalledWith({
      adults: 2,
      children: 0,
      infants: 1,
      travelClass: 'economy',
    })
  })
  it('не позволяет выбрать младенцев больше, чем взрослых', () => {
    const onChange = vi.fn()

    const value = {
      adults: 1,
      children: 0,
      infants: 1,
      travelClass: 'economy' as const,
    }

    render(<PassengerSelector value={value} onChange={onChange} />)

    const incrementButton = screen.getByRole('button', {
      name: 'Увеличить количество младенцев',
    })

    expect(incrementButton).toBeDisabled()

    fireEvent.click(incrementButton)

    expect(onChange).not.toHaveBeenCalled()
  })
  it('выбирает бизнес-класс', () => {
    const onChange = vi.fn()

    const value = {
      adults: 2,
      children: 0,
      infants: 0,
      travelClass: 'economy' as const,
    }

    render(<PassengerSelector value={value} onChange={onChange} />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Бизнес',
      }),
    )

    expect(onChange).toHaveBeenCalledWith({
      adults: 2,
      children: 0,
      infants: 0,
      travelClass: 'business',
    })
  })
  it('выбирает экономкласс', () => {
    const onChange = vi.fn()

    const value = {
      adults: 2,
      children: 0,
      infants: 0,
      travelClass: 'business' as const,
    }

    render(<PassengerSelector value={value} onChange={onChange} />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Эконом',
      }),
    )

    expect(onChange).toHaveBeenCalledWith({
      adults: 2,
      children: 0,
      infants: 0,
      travelClass: 'economy',
    })
  })
})
