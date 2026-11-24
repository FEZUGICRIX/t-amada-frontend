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
