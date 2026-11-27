import type { Flight } from '@/pages/flight-selection/types'

export type BookingService = { id: string; name: string; price: number }
export type BookingTrip = {
  origin: string
  destination: string
  departureDate: string | null
  returnDate: string | null
  passengers: number
  passengerCounts?: { adults: number; children: number; infants: number }
  outbound?: Flight
  inbound?: Flight
  hotelName?: string
  insuranceName?: string
  transferName?: string
  transferRoundTrip?: boolean
}
export type DemoBooking = {
  services: BookingService[]
  total: number
  startedAt: number
  trip?: BookingTrip
  failedServiceId?: string
  paymentStatus?: 'not_charged' | 'unknown'
}

export function readBooking(): DemoBooking | null {
  try {
    const booking = JSON.parse(
      sessionStorage.getItem('demo-booking') || 'null',
    ) as DemoBooking | null
    return booking && Array.isArray(booking.services) && booking.services.length ? booking : null
  } catch {
    return null
  }
}

export const STEP_MS = 3000

const BOOKINGS_KEY = 'trip-booking-history'

export function readBookings(): DemoBooking[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]')
    if (!Array.isArray(value)) return []
    return value
      .filter(
        (item): item is DemoBooking =>
          item !== null &&
          typeof item === 'object' &&
          Number.isFinite(item.startedAt) &&
          Number.isFinite(item.total) &&
          Array.isArray(item.services) &&
          item.services.length > 0,
      )
      .sort((a, b) => b.startedAt - a.startedAt)
  } catch {
    return []
  }
}

export function saveBooking(booking: DemoBooking): void {
  try {
    const bookings = readBookings().filter((item) => item.startedAt !== booking.startedAt)
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([booking, ...bookings]))
  } catch {
    // The current booking remains available in session storage.
  }
}

export function getBookingStatus(
  booking: DemoBooking,
  now = Date.now(),
): 'pending' | 'success' | 'cancelled' {
  const failedIndex = booking.services.findIndex(
    (service) => service.id === booking.failedServiceId,
  )
  const endStep = failedIndex < 0 ? booking.services.length : failedIndex + 1
  if (now < booking.startedAt + endStep * STEP_MS) return 'pending'
  return failedIndex < 0 ? 'success' : 'cancelled'
}
