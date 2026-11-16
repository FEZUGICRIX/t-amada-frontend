import { describe, expect, it } from 'vitest'
import { formatFlightPassengers } from './flightPriceDescription'

describe('Описание пассажиров', () => {
  it('не показывает детей и младенцев, если они не выбраны', () => {
    expect(formatFlightPassengers({ adults: 2, children: 0, infants: 0 })).toBe('2 взрослых')
  })
  it('показывает выбранных детей и бесплатных младенцев', () => {
    expect(formatFlightPassengers({ adults: 1, children: 2, infants: 1 })).toBe(
      '1 взрослый, 2 ребёнка · 1 младенец бесплатно',
    )
  })
})
