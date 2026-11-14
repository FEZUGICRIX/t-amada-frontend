import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import FlightCard from './FlightCard'
import { outboundFlights } from './mockFlights'

describe('FlightCard', () => {
  it('позволяет выбрать рейс с клавиатуры', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<FlightCard flight={outboundFlights[0]} isSelected={false} onSelect={onSelect} />)
    await user.tab()
    expect(screen.getByRole('button', { name: 'Выбрать' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledOnce()
  })
  it('отображает данные рейса', () => {
    render(<FlightCard flight={outboundFlights[2]} isSelected={false} onSelect={() => undefined} />)

    expect(screen.getByRole('heading', { name: 'Россия + Аэрофлот' })).toBeInTheDocument()
    expect(screen.getByText('Москва, SVO')).toBeInTheDocument()
    expect(screen.getByText('Сочи, AER')).toBeInTheDocument()
    expect(screen.getByText('6 ч 35 мин')).toBeInTheDocument()
    expect(screen.getByText('1 пересадка')).toBeInTheDocument()
    expect(screen.getByText('багаж 23 кг')).toBeInTheDocument()
    expect(screen.getByText('эконом')).toBeInTheDocument()
    expect(screen.getByText('11 980 ₽')).toBeInTheDocument()
  })

  it('обозначает рейс без пересадок как прямой', () => {
    render(<FlightCard flight={outboundFlights[0]} isSelected={false} onSelect={() => undefined} />)

    expect(screen.getByText('прямой рейс')).toBeInTheDocument()
  })

  it('передаёт идентификатор выбранного рейса', () => {
    const onSelect = vi.fn()

    render(<FlightCard flight={outboundFlights[0]} isSelected={false} onSelect={onSelect} />)

    fireEvent.click(screen.getByRole('button', { name: 'Выбрать' }))

    expect(onSelect).toHaveBeenCalledWith('aeroflot-1')
  })

  it('выбирает рейс по нажатию на карточку', () => {
    const onSelect = vi.fn()

    render(<FlightCard flight={outboundFlights[0]} isSelected={false} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('article', { name: 'Рейс Аэрофлот' }))

    expect(onSelect).toHaveBeenCalledWith('aeroflot-1')
  })
})
