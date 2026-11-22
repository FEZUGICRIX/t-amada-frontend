import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import FlightCard from './FlightCard'
import { outboundFlights, returnFlights } from './mockFlights'

describe('FlightCard', () => {
  it('показывает город, аэропорт, ожидание и расчёт времени для нескольких пересадок', () => {
    const flight = outboundFlights.find((item) => item.id === 'demo-3-stops')!
    render(<FlightCard flight={flight} isSelected={false} onSelect={() => undefined} />)
    const route = screen.getByLabelText('Маршрут с пересадками')
    expect(route).toHaveTextContent('Пересадка: Казань, KZN')
    expect(route).toHaveTextContent('Пересадка: Екатеринбург, SVX')
    expect(route).toHaveTextContent('Пересадка: Самара, KUF')
    expect(route).toHaveTextContent('Ожидание 45 мин')
    expect(route).toHaveTextContent('Ожидание 50 мин')
    expect(route).toHaveTextContent('Ожидание 1 ч')
    expect(route).toHaveTextContent('В полёте 5 ч 25 мин · На пересадки 2 ч 35 мин · Всего 8 ч')
    expect(screen.getByText('3 пересадки')).toBeInTheDocument()
  })
  it('не выдумывает длительности участков при отсутствии данных', () => {
    const flight = { ...outboundFlights[2], segmentMinutes: undefined }
    render(<FlightCard flight={flight} isSelected={false} onSelect={() => undefined} />)
    expect(screen.getByLabelText('Маршрут с пересадками')).toHaveTextContent(
      'Пересадка: Санкт-Петербург, LED',
    )
    expect(screen.getByLabelText('Маршрут с пересадками')).toHaveTextContent('Ожидание 1 ч 35 мин')
    expect(screen.getByLabelText('Маршрут с пересадками')).toHaveTextContent(
      'Время прилёта и следующего вылета уточняется',
    )
    expect(screen.getByLabelText('Маршрут с пересадками')).not.toHaveTextContent('В полёте')
  })
  it('содержит согласованные тестовые данные для 0, 1, 2 и 3 пересадок в обоих направлениях', () => {
    for (const flights of [outboundFlights, returnFlights]) {
      expect(new Set(flights.map((flight) => flight.stops.length))).toEqual(new Set([0, 1, 2, 3]))
      for (const flight of flights.filter((item) => item.stops.length)) {
        const segments = flight.segmentMinutes!
        expect(segments).toHaveLength(flight.stops.length + 1)
        const total =
          segments.reduce((sum, minutes) => sum + minutes, 0) +
          flight.stops.reduce((sum, stop) => sum + stop.waitMinutes!, 0)
        const [departureHours, departureMinutes] = flight.departure.time.split(':').map(Number)
        const [arrivalHours, arrivalMinutes] = flight.arrival.time.split(':').map(Number)
        const minutes = arrivalHours * 60 + arrivalMinutes - departureHours * 60 - departureMinutes
        expect(total).toBe(minutes + (flight.arrivalDayOffset ?? (minutes < 0 ? 1 : 0)) * 1440)
      }
    }
  })
  it('показывает сутки ожидания, даты и местное время каждой пересадки', () => {
    const flight = outboundFlights.find((item) => item.id === 'demo-2-stops')!
    render(
      <FlightCard
        flight={flight}
        date="2026-12-01"
        isSelected={false}
        onSelect={() => undefined}
      />,
    )
    const route = screen.getByLabelText('Маршрут с пересадками')
    expect(route).toHaveTextContent('Ожидание 24 ч')
    expect(screen.getByLabelText('Схема пересадок')).toHaveTextContent('24 ч')
    expect(screen.getByLabelText('Схема пересадок')).toHaveTextContent('50 мин')
    expect(route).toHaveTextContent('Прилёт 07:15 · 1 декабря')
    expect(route).toHaveTextContent('Следующий вылет 07:15 · 2 декабря')
    expect(route).toHaveTextContent('Прилёт 10:25 · 2 декабря')
    expect(route).toHaveTextContent('Следующий вылет 11:15 · 2 декабря')
    expect(screen.getByText('+1 день')).toBeInTheDocument()
  })
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
