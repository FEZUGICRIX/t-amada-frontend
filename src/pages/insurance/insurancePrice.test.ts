import { describe, expect, it } from 'vitest'
import { getInsuranceDays, getInsurancePrice } from './insurancePrice'

describe('Расчёт страховки', () => {
  it('считает оба конца периода и тарифы для двух взрослых', () => {
    const period = { start: '2026-11-22', end: '2026-11-27' }
    const search = { passengers: { adults: 2, children: 0, infants: 0 } }
    expect(getInsuranceDays(period)).toBe(6)
    expect(getInsurancePrice(75, period, search)).toBe(900)
    expect(getInsurancePrice(90, period, search)).toBe(1080)
  })
  it('применяет 70% для детей и бесплатную страховку для младенцев', () => {
    const period = { start: '2026-11-22', end: '2026-11-27' }
    expect(
      getInsurancePrice(75, period, { passengers: { adults: 2, children: 1, infants: 1 } }),
    ).toBe(1215)
    expect(
      getInsurancePrice(
        75,
        { start: '2026-11-22', end: '2026-11-22' },
        { passengers: { adults: 1, children: 1, infants: 0 } },
      ),
    ).toBe(128)
  })
  it('не рассчитывает при отсутствующем или неверном периоде', () => {
    expect(getInsuranceDays({ start: '2026-02-30', end: '2026-03-02' })).toBeNull()
    expect(getInsuranceDays({ start: '2026-11-27', end: '2026-11-22' })).toBeNull()
    expect(getInsurancePrice(75, { start: null, end: null }, null)).toBeNull()
  })
})
