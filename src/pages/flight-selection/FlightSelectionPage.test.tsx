import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FlightSelectionPage from './FlightSelectionPage'

describe('FlightSelectionPage', () => {
  it('renders the page heading', () => {
    render(<FlightSelectionPage />)

    expect(
      screen.getByRole('heading', {
        name: 'Выберите рейс туда',
      }),
    ).toBeInTheDocument()
  })

  it('renders the trip summary', () => {
    render(<FlightSelectionPage />)

    expect(screen.getByText('Москва → Сочи · 12 октября · 2 взрослых · эконом')).toBeInTheDocument()
  })
  it('renders the available flights', () => {
    render(<FlightSelectionPage />)

    expect(screen.getByText('6 рейсов')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(3)

    expect(screen.getByText('Аэрофлот')).toBeInTheDocument()
    expect(screen.getByText('Победа')).toBeInTheDocument()
    expect(screen.getByText('Россия + Аэрофлот')).toBeInTheDocument()
  })

  it('renders the trip price summary', () => {
    render(<FlightSelectionPage />)

    expect(
      screen.getByRole('heading', {
        name: 'Ваша поездка',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Итого')).toBeInTheDocument()
    expect(screen.getAllByText('25 230 ₽')).toHaveLength(2)
  })

  it('updates the total after selecting another flight', () => {
    render(<FlightSelectionPage />)

    const pobedaCard = screen.getByRole('article', { name: 'Рейс Победа' })

    fireEvent.click(within(pobedaCard).getByRole('button', { name: 'Выбрать' }))

    expect(screen.getAllByText('22 630 ₽')).toHaveLength(2)
  })

  it('selects a flight from the list', () => {
    render(<FlightSelectionPage />)

    const pobedaCard = screen.getByRole('article', { name: 'Рейс Победа' })

    fireEvent.click(within(pobedaCard).getByRole('button', { name: 'Выбрать' }))

    expect(within(pobedaCard).getByRole('button', { name: 'Выбрано' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('shows return flights after continuing', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(
      screen.getByRole('heading', {
        name: 'Выберите рейс обратно',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Сочи → Москва')).toBeInTheDocument()
  })
})
