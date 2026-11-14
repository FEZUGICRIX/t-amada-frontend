import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import FlightList from './FlightList'
import { outboundFlights } from './mockFlights'

describe('FlightList', () => {
  it('показывает доступное состояние загрузки рейсов', () => {
    render(<FlightList flights={[]} selectedFlightId={null} onSelect={() => undefined} isLoading />)
    expect(screen.getByRole('status', { name: 'Загрузка рейсов' })).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })
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
  it('изначально показывает первые три рейса', () => {
    render(
      <FlightList flights={outboundFlights} selectedFlightId={null} onSelect={() => undefined} />,
    )

    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Показать ещё' })).toBeInTheDocument()
  })

  it('показывает следующие рейсы по кнопке', () => {
    render(
      <FlightList flights={outboundFlights} selectedFlightId={null} onSelect={() => undefined} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Показать ещё' }))

    expect(screen.getAllByRole('article')).toHaveLength(6)
    expect(screen.queryByRole('button', { name: 'Показать ещё' })).not.toBeInTheDocument()
  })

  it('подгружает рейсы при прокрутке', () => {
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
