import { describe, expect, it } from 'vitest'
import type { Flight } from './types'
import { DEFAULT_FLIGHT_FILTERS, filterAndSortFlights, type FlightFilters } from './flightFilters'

const flights: Flight[] = [
  {
    id: 'expensive-direct',
    airline: 'Аэрофлот',
    code: 'SU',
    departure: { city: 'Москва', airport: 'SVO', time: '10:00' },
    arrival: { city: 'Сочи', airport: 'AER', time: '14:00' },
    duration: '4 ч',
    stops: [],
    baggage: 'без багажа',
    travelClass: 'economy',
    price: 300,
  },
  {
    id: 'cheap-transfer',
    airline: 'Победа',
    code: 'DP',
    departure: { city: 'Москва', airport: 'VKO', time: '11:00' },
    arrival: { city: 'Сочи', airport: 'AER', time: '16:00' },
    duration: '5 ч',
    stops: [{ airport: 'KZN', duration: '1 ч' }],
    baggage: '10 кг',
    travelClass: 'economy',
    price: 100,
  },
  {
    id: 'middle-direct',
    airline: 'S7 Airlines',
    code: 'S7',
    departure: { city: 'Москва', airport: 'DME', time: '12:00' },
    arrival: { city: 'Сочи', airport: 'AER', time: '16:00' },
    duration: '4 ч',
    stops: [],
    baggage: '23 кг',
    travelClass: 'business',
    price: 200,
  },
]

function createFilters(overrides: Partial<FlightFilters>): FlightFilters {
  return { ...DEFAULT_FLIGHT_FILTERS, ...overrides }
}

describe('filterAndSortFlights', () => {
  it('сохраняет порядок и исходные данные при фильтрах по умолчанию', () => {
    const result = filterAndSortFlights(flights, DEFAULT_FLIGHT_FILTERS)

    expect(result.map((flight) => flight.id)).toEqual([
      'expensive-direct',
      'cheap-transfer',
      'middle-direct',
    ])
    expect(result).not.toBe(flights)
  })

  it('включает рейсы с ценой на границах диапазона', () => {
    const result = filterAndSortFlights(flights, createFilters({ minPrice: 100, maxPrice: 200 }))

    expect(result.map((flight) => flight.id)).toEqual(['cheap-transfer', 'middle-direct'])
  })

  it('фильтрует прямые рейсы и рейсы с пересадками', () => {
    const directFlights = filterAndSortFlights(flights, createFilters({ stops: 'direct' }))
    const flightsWithStops = filterAndSortFlights(flights, createFilters({ stops: 'with-stops' }))

    expect(directFlights.map((flight) => flight.id)).toEqual(['expensive-direct', 'middle-direct'])
    expect(flightsWithStops.map((flight) => flight.id)).toEqual(['cheap-transfer'])
  })

  it('фильтрует рейсы по багажу', () => {
    const withBaggage = filterAndSortFlights(flights, createFilters({ baggage: 'with' }))
    const withoutBaggage = filterAndSortFlights(flights, createFilters({ baggage: 'without' }))

    expect(withBaggage.map((flight) => flight.id)).toEqual(['cheap-transfer', 'middle-direct'])
    expect(withoutBaggage.map((flight) => flight.id)).toEqual(['expensive-direct'])
  })

  it('использует ИЛИ для авиакомпаний и И между группами фильтров', () => {
    const result = filterAndSortFlights(
      flights,
      createFilters({
        minPrice: 150,
        stops: 'direct',
        baggage: 'with',
        airlines: ['Аэрофлот', 'S7 Airlines'],
      }),
    )

    expect(result.map((flight) => flight.id)).toEqual(['middle-direct'])
  })

  it('сохраняет все подходящие авиакомпании', () => {
    const result = filterAndSortFlights(
      flights,
      createFilters({ airlines: ['Аэрофлот', 'S7 Airlines'] }),
    )

    expect(result.map((flight) => flight.id)).toEqual(['expensive-direct', 'middle-direct'])
  })

  it('сортирует по цене без изменения исходного массива', () => {
    const ascending = filterAndSortFlights(flights, createFilters({ sort: 'price-asc' }))
    const descending = filterAndSortFlights(flights, createFilters({ sort: 'price-desc' }))

    expect(ascending.map((flight) => flight.id)).toEqual([
      'cheap-transfer',
      'middle-direct',
      'expensive-direct',
    ])
    expect(descending.map((flight) => flight.id)).toEqual([
      'expensive-direct',
      'middle-direct',
      'cheap-transfer',
    ])
    expect(flights.map((flight) => flight.id)).toEqual([
      'expensive-direct',
      'cheap-transfer',
      'middle-direct',
    ])
  })
})
