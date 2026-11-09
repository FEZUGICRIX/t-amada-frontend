import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import FlightSelectionPage from './FlightSelectionPage'

let intersectionCallback: IntersectionObserverCallback = () => undefined

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly scrollMargin = ''
  readonly thresholds = []

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback
  }

  disconnect = vi.fn()
  observe = vi.fn()
  takeRecords = vi.fn(() => [])
  unobserve = vi.fn()
}

describe('FlightSelectionPage', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  })

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

    expect(screen.getByText('27 рейсов')).toBeInTheDocument()
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
    expect(screen.getAllByText('25 640 ₽')).toHaveLength(2)
  })

  it('loads more flights when the loader enters the viewport', () => {
    render(<FlightSelectionPage />)

    expect(screen.getAllByRole('article')).toHaveLength(3)

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )
    })

    expect(screen.getAllByRole('article')).toHaveLength(6)
  })
})
