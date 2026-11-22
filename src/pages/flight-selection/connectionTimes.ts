import type { Flight } from './types'

type LocalEvent = { time: string; dayOffset: number }
export type ConnectionTimes = { arrival: LocalEvent; departure: LocalEvent }

export function getConnectionTimes(flight: Flight): (ConnectionTimes | null)[] {
  const departure = /^(\d{2}):(\d{2})$/.exec(flight.departure.time)
  if (
    !departure ||
    flight.departureUtcOffsetMinutes == null ||
    !flight.segmentMinutes ||
    flight.segmentMinutes.length !== flight.stops.length + 1
  )
    return flight.stops.map(() => null)
  const base = Number(departure[1]) * 60 + Number(departure[2]) - flight.departureUtcOffsetMinutes
  let elapsed = 0
  return flight.stops.map((stop, index) => {
    const leg = flight.segmentMinutes![index]
    if (
      !Number.isFinite(leg) ||
      leg < 0 ||
      !Number.isFinite(stop.waitMinutes) ||
      stop.waitMinutes! <= 0 ||
      stop.utcOffsetMinutes == null
    ) {
      elapsed = Number.NaN
      return null
    }
    elapsed += leg
    const localEvent = (minute: number): LocalEvent => {
      const local = base + minute + stop.utcOffsetMinutes!
      const dayOffset = Math.floor(local / 1440)
      const withinDay = ((local % 1440) + 1440) % 1440
      return {
        time: `${String(Math.floor(withinDay / 60)).padStart(2, '0')}:${String(withinDay % 60).padStart(2, '0')}`,
        dayOffset,
      }
    }
    if (!Number.isFinite(elapsed)) return null
    const arrival = localEvent(elapsed)
    elapsed += stop.waitMinutes!
    return { arrival, departure: localEvent(elapsed) }
  })
}

export function formatConnectionDate(date: string | null | undefined, dayOffset: number) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return dayOffset ? `день ${dayOffset + 1}` : ''
  const value = new Date(`${date}T12:00:00Z`)
  if (Number.isNaN(value.getTime())) return ''
  value.setUTCDate(value.getUTCDate() + dayOffset)
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(value)
}
