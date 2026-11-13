import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import FlightSelectionPage from './FlightSelectionPage'
import TripSearchForm from '@/features/trip-search/TripSearchForm'

describe('FlightSelectionPage', () => {
  beforeEach(() => sessionStorage.clear())
  it('shows a per-ticket price and totals adults and children while infants travel free', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        origin: 'Москва',
        destination: 'Сочи',
        departureDate: '2026-12-01',
        returnDate: null,
        isOneWay: true,
        passengers: { adults: 3, children: 2, infants: 1, travelClass: 'economy' },
      }),
    )
    render(<FlightSelectionPage />)
    const flight = screen.getByRole('article', { name: 'Рейс Аэрофлот' })
    expect(within(flight).getByText('12 440 ₽')).toBeInTheDocument()
    expect(within(flight).getByText('За 1 билет')).toBeInTheDocument()
    fireEvent.click(flight)
    expect(screen.getAllByText('62 200 ₽')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Цена до' }), {
      target: { value: '12000' },
    })
    expect(screen.queryByRole('article', { name: 'Рейс Аэрофлот' })).not.toBeInTheDocument()
  })
  it('shows only flights in the selected class in both directions', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        origin: 'Москва',
        destination: 'Сочи',
        departureDate: '2026-12-01',
        returnDate: '2026-12-07',
        isOneWay: false,
        passengers: { adults: 2, children: 0, infants: 0, travelClass: 'business' },
      }),
    )
    sessionStorage.setItem(
      'selected-flights',
      JSON.stringify({ outbound: 'aeroflot-1', return: 'return-aeroflot-1' }),
    )
    render(<FlightSelectionPage />)
    expect(screen.getByRole('heading', { name: '1 рейс' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Рейс S7 Airlines' })).toBeInTheDocument()
    expect(screen.queryByRole('article', { name: 'Рейс Аэрофлот' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
    expect(screen.getAllByText('0 ₽')).toHaveLength(2)
    fireEvent.click(screen.getByRole('article', { name: 'Рейс S7 Airlines' }))
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(screen.getByRole('heading', { name: 'Выберите рейс обратно' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Рейс S7 Airlines' })).toBeInTheDocument()
    expect(screen.queryByRole('article', { name: 'Рейс Аэрофлот' })).not.toBeInTheDocument()
  })
  it('passes one-way search data from the form to the flight page', () => {
    const { unmount } = render(
      <TripSearchForm
        onSearch={(search) => sessionStorage.setItem('trip-search', JSON.stringify(search))}
      />,
    )
    fireEvent.change(screen.getByRole('combobox', { name: 'Куда' }), { target: { value: 'Сочи' } })
    fireEvent.click(screen.getByRole('checkbox', { name: 'Билет в одну сторону' }))
    fireEvent.click(screen.getByRole('button', { name: 'Найти билеты' }))
    unmount()
    render(<FlightSelectionPage />)
    expect(screen.getByText(/Москва → Сочи · Дата не выбрана/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('article', { name: 'Рейс Аэрофлот' }))
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(screen.getByRole('status')).toHaveTextContent('Рейсы выбраны')
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
    expect(screen.getAllByText('0 ₽')).toHaveLength(2)
  })

  it('updates the total after selecting another flight', () => {
    render(<FlightSelectionPage />)

    const pobedaCard = screen.getByRole('article', { name: 'Рейс Победа' })

    fireEvent.click(within(pobedaCard).getByRole('button', { name: 'Выбрать' }))

    expect(screen.getAllByText('9 840 ₽').length).toBeGreaterThanOrEqual(2)
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

    fireEvent.click(screen.getByRole('article', { name: 'Рейс Аэрофлот' }))
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(
      screen.getByRole('heading', {
        name: 'Выберите рейс обратно',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Сочи → Москва')).toBeInTheDocument()
  })

  it('keeps draft filters after closing and reopening the panel', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Цена от' }), {
      target: { value: '12000' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть фильтры' }))
    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))

    expect(screen.getByRole('textbox', { name: 'Цена от' })).toHaveValue('12 000 ₽')
  })

  it('closes filters with Escape and returns focus to the trigger', () => {
    render(<FlightSelectionPage />)

    const filtersButton = screen.getByRole('button', { name: /Фильтры и сортировка/ })

    filtersButton.focus()
    fireEvent.click(filtersButton)
    expect(screen.getByRole('button', { name: 'Закрыть фильтры' })).toHaveFocus()

    fireEvent.keyDown(screen.getByLabelText('Фильтры и сортировка'), { key: 'Escape' })

    expect(screen.queryByLabelText('Фильтры и сортировка')).not.toBeInTheDocument()
    expect(filtersButton).toHaveFocus()
  })

  it('applies filters and updates the result count', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Прямой' }))
    expect(screen.getByRole('heading', { name: '4 рейса' })).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Фильтры и сортировка' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть фильтры' }))

    expect(screen.getByRole('heading', { name: '4 рейса' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Фильтры и сортировка')).not.toBeInTheDocument()
  })

  it('sorts the visible flights by price', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Сначала дешевле' }))
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть фильтры' }))

    expect(screen.getAllByRole('article')[0]).toHaveAccessibleName('Рейс Победа')
  })

  it('resets applied filters and restores every flight', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.click(screen.getByRole('button', { name: 'С пересадкой' }))
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть фильтры' }))
    expect(screen.getByRole('heading', { name: '2 рейса' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить' }))

    expect(screen.getByRole('heading', { name: '6 рейсов' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'С пересадкой' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('shows an empty state when no flight matches', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Цена от' }), {
      target: { value: '40000' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть фильтры' }))

    expect(screen.getByRole('heading', { name: '0 рейсов' })).toBeInTheDocument()
    expect(screen.getByText('Рейсы не найдены')).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить фильтры' }))
    expect(screen.getByRole('heading', { name: '6 рейсов' })).toBeInTheDocument()
  })

  it('shows selected outbound and return flights in the summary', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        origin: 'Москва',
        destination: 'Сочи',
        departureDate: '2026-10-12',
        returnDate: '2026-10-18',
        isOneWay: false,
        passengers: { adults: 2, children: 0, infants: 0, travelClass: 'economy' },
      }),
    )
    render(<FlightSelectionPage />)
    fireEvent.click(screen.getByRole('article', { name: 'Рейс Победа' }))
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    fireEvent.click(screen.getByRole('article', { name: 'Рейс Аэрофлот' }))
    const summary = screen.getByLabelText('Выбранные рейсы')
    expect(within(summary).getByText('12 октября 2026 г.')).toBeInTheDocument()
    expect(within(summary).getByText('18 октября 2026 г.')).toBeInTheDocument()
    expect(within(summary).getByText(/Победа · 12:45 - 16:25/)).toBeInTheDocument()
    expect(within(summary).getByText(/Аэрофлот · 09:15 - 13:05/)).toBeInTheDocument()
    expect(screen.getAllByText('45 260 ₽')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(screen.getByRole('status')).toHaveTextContent('Рейсы выбраны')
  })

  it('preserves a selected flight when filters hide it', () => {
    render(<FlightSelectionPage />)

    fireEvent.click(screen.getByRole('article', { name: 'Рейс Аэрофлот' }))

    fireEvent.click(screen.getByRole('button', { name: /Фильтры и сортировка/ }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Цена до' }), {
      target: { value: '10000' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть фильтры' }))

    expect(screen.getByRole('article', { name: 'Рейс Победа' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Выбрано' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeDisabled()
    expect(screen.getAllByText('12 440 ₽')).toHaveLength(2)
  })

  it('skips return flights and excludes their price for a one-way trip', () => {
    sessionStorage.setItem(
      'trip-search',
      JSON.stringify({
        origin: 'Москва',
        destination: 'Сочи',
        departureDate: '2026-11-20',
        returnDate: null,
        isOneWay: true,
        passengers: { adults: 2, children: 0, infants: 0, travelClass: 'economy' },
      }),
    )
    render(<FlightSelectionPage />)
    fireEvent.click(screen.getByRole('article', { name: 'Рейс Аэрофлот' }))
    expect(screen.getAllByText('24 880 ₽')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    expect(screen.getByRole('heading', { name: 'Выберите рейс туда' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Рейсы выбраны')
    sessionStorage.removeItem('trip-search')
  })

  it('returns to the selected outbound flight', () => {
    render(<FlightSelectionPage />)
    fireEvent.click(screen.getByRole('article', { name: 'Рейс Победа' }))
    fireEvent.click(screen.getByRole('button', { name: 'Продолжить' }))
    fireEvent.click(screen.getByRole('button', { name: 'Назад' }))
    expect(
      within(screen.getByRole('article', { name: 'Рейс Победа' })).getByRole('button', {
        name: 'Выбрано',
      }),
    ).toBeInTheDocument()
  })
})
