import type { InsuranceSearch } from './insuranceTrip'

export function getInsurancePassengerCount(search: InsuranceSearch): number {
  if (!search?.passengers) return 1
  const { adults = 0, children = 0, infants = 0 } = search.passengers
  return adults + children + infants
}

export function getInsuranceDays(period: {
  start: string | null
  end: string | null
}): number | null {
  if (
    !period.start ||
    !period.end ||
    !/^\d{4}-\d{2}-\d{2}$/.test(period.start) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(period.end)
  )
    return null
  const start = new Date(`${period.start}T00:00:00Z`)
  const end = new Date(`${period.end}T00:00:00Z`)
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start.toISOString().slice(0, 10) !== period.start ||
    end.toISOString().slice(0, 10) !== period.end ||
    end < start
  )
    return null
  return (end.getTime() - start.getTime()) / 86400000 + 1
}
export function getInsurancePrice(
  dailyRate: number,
  period: { start: string | null; end: string | null },
  search: InsuranceSearch,
): number | null {
  const days = getInsuranceDays(period)
  if (days === null) return null
  const adults = search?.passengers?.adults ?? 1
  const children = search?.passengers?.children ?? 0
  return Math.round((dailyRate * days * (adults * 10 + children * 7)) / 10)
}
