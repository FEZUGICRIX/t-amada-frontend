import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FlightList from './FlightList'
import { outboundFlights } from './mockFlights'

describe('FlightList', () => {
  it('renders the first three flights initially', () => {
    render(
      <FlightList flights={outboundFlights} selectedFlightId={null} onSelect={() => undefined} />,
    )

    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Показать ещё' })).toBeInTheDocument()
  })

  it('renders the next flights after clicking show more', () => {
    render(
      <FlightList flights={outboundFlights} selectedFlightId={null} onSelect={() => undefined} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Показать ещё' }))

    expect(screen.getAllByRole('article')).toHaveLength(6)
    expect(screen.queryByRole('button', { name: 'Показать ещё' })).not.toBeInTheDocument()
  })
})
