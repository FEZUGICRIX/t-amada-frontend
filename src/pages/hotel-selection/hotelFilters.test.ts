import { describe, expect, it } from 'vitest'
import { hotels } from './hotels'
import { defaultHotelFilters, filterHotels } from './hotelFilters'

describe('hotel filters', () => {
  it('filters by inclusive price and combined conditions', () => {
    const result = filterHotels(hotels, {
      ...defaultHotelFilters,
      minPrice: 43800,
      maxPrice: 43800,
      breakfast: true,
      freeCancellation: true,
    })
    expect(result.map((hotel) => hotel.id)).toEqual(['sea-galaxy'])
  })
  it('sorts without changing the source list', () => {
    const result = filterHotels(hotels, { ...defaultHotelFilters, sort: 'cheap' })
    expect(result[0].id).toBe('demo-hotel')
    expect(hotels[0].id).toBe('sea-galaxy')
  })
  it('returns no hotels for an unmatched range', () => {
    expect(filterHotels(hotels, { ...defaultHotelFilters, minPrice: 999999 })).toEqual([])
  })
})
