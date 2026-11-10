import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import FlightList from './FlightList'
import { outboundFlights } from './mockFlights'

describe('FlightList', () => {
  let intersectionCallback: IntersectionObserverCallback

  beforeEach(() => {
    class IntersectionObserverMock {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback
      }

      observe = vi.fn()
      disconnect = vi.fn()
      unobserve = vi.fn()
    }

    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  })
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

  it('loads the next flights when the loader enters the viewport', () => {
    render(
      <FlightList flights={outboundFlights} selectedFlightId={null} onSelect={() => undefined} />,
    )

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )
    })

    expect(screen.getAllByRole('article')).toHaveLength(6)
  })
})
