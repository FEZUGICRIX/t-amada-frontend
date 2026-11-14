import { describe, expect, it } from 'vitest'
import { hotels } from './hotels'
import { defaultHotelFilters, filterHotels } from './hotelFilters'

describe('Фильтры отелей', () => {
  it('фильтрует по цене с включением границ и сочетанию условий', () => {
    const result = filterHotels(hotels, {
      ...defaultHotelFilters,
      minPrice: 43800,
      maxPrice: 43800,
      breakfast: true,
      freeCancellation: true,
    })
    expect(result.map((hotel) => hotel.id)).toEqual(['sea-galaxy'])
  })
  it('сортирует без изменения исходного списка', () => {
    const result = filterHotels(hotels, { ...defaultHotelFilters, sort: 'cheap' })
    expect(result[0].id).toBe('demo-hotel')
    expect(hotels[0].id).toBe('sea-galaxy')
  })
  it('возвращает пустой список, если цена не подходит', () => {
    expect(filterHotels(hotels, { ...defaultHotelFilters, minPrice: 999999 })).toEqual([])
  })
})
