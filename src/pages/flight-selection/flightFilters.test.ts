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
  it('keeps the source order with default filters without mutating the source', () => {
    const result = filterAndSortFlights(flights, DEFAULT_FLIGHT_FILTERS)

    expect(result.map((flight) => flight.id)).toEqual([
      'expensive-direct',
      'cheap-transfer',
      'middle-direct',
    ])
    expect(result).not.toBe(flights)
  })

  it('includes flights on both price boundaries', () => {
    const result = filterAndSortFlights(flights, createFilters({ minPrice: 100, maxPrice: 200 }))

    expect(result.map((flight) => flight.id)).toEqual(['cheap-transfer', 'middle-direct'])
  })

  it('filters direct flights and flights with stops', () => {
    const directFlights = filterAndSortFlights(flights, createFilters({ stops: 'direct' }))
    const flightsWithStops = filterAndSortFlights(flights, createFilters({ stops: 'with-stops' }))

    expect(directFlights.map((flight) => flight.id)).toEqual(['expensive-direct', 'middle-direct'])
    expect(flightsWithStops.map((flight) => flight.id)).toEqual(['cheap-transfer'])
  })

  it('filters flights by baggage', () => {
    const withBaggage = filterAndSortFlights(flights, createFilters({ baggage: 'with' }))
    const withoutBaggage = filterAndSortFlights(flights, createFilters({ baggage: 'without' }))

    expect(withBaggage.map((flight) => flight.id)).toEqual(['cheap-transfer', 'middle-direct'])
    expect(withoutBaggage.map((flight) => flight.id)).toEqual(['expensive-direct'])
  })

  it('uses OR logic for airlines and AND logic between filter groups', () => {
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

  it('keeps every selected airline when several airlines match', () => {
    const result = filterAndSortFlights(
      flights,
      createFilters({ airlines: ['Аэрофлот', 'S7 Airlines'] }),
    )

    expect(result.map((flight) => flight.id)).toEqual(['expensive-direct', 'middle-direct'])
  })

  it('sorts by price without changing the source array', () => {
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
