import { outboundFlights, returnFlights } from '@/pages/flight-selection/mockFlights'

export function getTripFlightPrice(): number {
  try {
    const search = JSON.parse(sessionStorage.getItem('trip-search') || 'null') as {
      isOneWay: boolean
      passengers: { adults: number; children: number }
    } | null
    const selected = JSON.parse(sessionStorage.getItem('selected-flights') || 'null') as {
      outbound: string | null
      return: string | null
    } | null
    const outbound = outboundFlights.find((flight) => flight.id === selected?.outbound)
    const inbound = search?.isOneWay
      ? undefined
      : returnFlights.find((flight) => flight.id === selected?.return)
    return (
      ((outbound?.price ?? 0) + (inbound?.price ?? 0)) *
      (search ? search.passengers.adults + search.passengers.children : 1)
    )
  } catch {
    return 0
  }
}
