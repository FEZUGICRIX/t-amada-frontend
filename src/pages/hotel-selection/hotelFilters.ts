import type { Hotel } from './hotels'

export type HotelFilters = {
  minPrice: number | null
  maxPrice: number | null
  stars: boolean
  breakfast: boolean
  freeCancellation: boolean
  sort: 'default' | 'cheap' | 'expensive'
}
export const defaultHotelFilters: HotelFilters = {
  minPrice: null,
  maxPrice: null,
  stars: false,
  breakfast: false,
  freeCancellation: false,
  sort: 'default',
}

export function filterHotels(hotels: Hotel[], filters: HotelFilters): Hotel[] {
  const result = hotels.filter(
    (hotel) =>
      (filters.minPrice === null || hotel.price >= filters.minPrice) &&
      (filters.maxPrice === null || hotel.price <= filters.maxPrice) &&
      (!filters.stars || hotel.stars >= 4) &&
      (!filters.breakfast || hotel.breakfast) &&
      (!filters.freeCancellation || hotel.freeCancellation),
  )
  if (filters.sort === 'cheap') return result.toSorted((a, b) => a.price - b.price)
  if (filters.sort === 'expensive') return result.toSorted((a, b) => b.price - a.price)
  return result
}
