import type { Flight } from './types'

export type StopsFilter = 'all' | 'direct' | 'with-stops'
export type BaggageFilter = 'all' | 'with' | 'without'
export type FlightSort = 'default' | 'price-asc' | 'price-desc'

export type FlightFilters = {
  minPrice: number | null
  maxPrice: number | null
  stops: StopsFilter
  baggage: BaggageFilter
  airlines: string[]
  sort: FlightSort
}

export const DEFAULT_FLIGHT_FILTERS: FlightFilters = {
  minPrice: null,
  maxPrice: null,
  stops: 'all',
  baggage: 'all',
  airlines: [],
  sort: 'default',
}

export function filterAndSortFlights(flights: Flight[], filters: FlightFilters): Flight[] {
  const filteredFlights = flights.filter((flight) => {
    const matchesPrice =
      (filters.minPrice === null || flight.price >= filters.minPrice) &&
      (filters.maxPrice === null || flight.price <= filters.maxPrice)
    const matchesStops =
      filters.stops === 'all' ||
      (filters.stops === 'direct' && flight.stops.length === 0) ||
      (filters.stops === 'with-stops' && flight.stops.length > 0)
    const matchesBaggage =
      filters.baggage === 'all' ||
      (filters.baggage === 'with' && flight.baggage !== 'без багажа') ||
      (filters.baggage === 'without' && flight.baggage === 'без багажа')
    const matchesAirline =
      filters.airlines.length === 0 || filters.airlines.includes(flight.airline)

    return matchesPrice && matchesStops && matchesBaggage && matchesAirline
  })

  if (filters.sort === 'price-asc') {
    return filteredFlights.toSorted(
      (firstFlight, secondFlight) => firstFlight.price - secondFlight.price,
    )
  }

  if (filters.sort === 'price-desc') {
    return filteredFlights.toSorted(
      (firstFlight, secondFlight) => secondFlight.price - firstFlight.price,
    )
  }

  return [...filteredFlights]
}
