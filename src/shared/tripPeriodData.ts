export type TripPeriod = { start: string | null; end: string | null }

export function getNights(period: TripPeriod): number | null {
  if (
    !period.start ||
    !period.end ||
    !/^\d{4}-\d{2}-\d{2}$/.test(period.start) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(period.end)
  )
    return null
  const start = Date.parse(`${period.start}T00:00:00Z`)
  const end = Date.parse(`${period.end}T00:00:00Z`)
  const nights = (end - start) / 86400000
  return Number.isInteger(nights) && nights > 0 ? nights : null
}

export function readHotelNights(): number | null {
  try {
    const search = JSON.parse(sessionStorage.getItem('trip-search') || 'null') as TripPeriodSearch
    return (
      getNights(readTripPeriod('hotel-period', search)) ??
      getNights(readTripPeriod('hotel-period', { isOneWay: true }))
    )
  } catch {
    return null
  }
}
export type TripPeriodSearch = {
  isOneWay?: boolean
  departureDate?: string | null
  returnDate?: string | null
} | null

export function readTripPeriod(key: string, search: TripPeriodSearch): TripPeriod {
  if (!search?.isOneWay)
    return { start: search?.departureDate ?? null, end: search?.returnDate ?? null }
  try {
    const value = JSON.parse(sessionStorage.getItem(key) || 'null') as TripPeriod | null
    return { start: value?.start ?? null, end: value?.end ?? null }
  } catch {
    return { start: null, end: null }
  }
}

export function formatTripPeriod(period: TripPeriod): string {
  const format = (value: string | null) => {
    if (!value) return 'не выбрана'
    const date = new Date(`${value}T00:00:00`)
    return Number.isNaN(date.getTime())
      ? 'не выбрана'
      : date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  }
  return `${format(period.start)} - ${format(period.end)}`
}
