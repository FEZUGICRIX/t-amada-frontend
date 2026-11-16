import { outboundFlights, returnFlights } from '@/pages/flight-selection/mockFlights'

export function getTripFlightDetails() {
  try {
    const search = JSON.parse(sessionStorage.getItem('trip-search') || 'null') as {
      isOneWay: boolean
      passengers: { adults: number; children: number; infants?: number }
    } | null
    const selected = JSON.parse(sessionStorage.getItem('selected-flights') || 'null') as {
      outbound: string | null
      return: string | null
    } | null
    const outbound = outboundFlights.find((flight) => flight.id === selected?.outbound)
    const inbound = search?.isOneWay
      ? undefined
      : returnFlights.find((flight) => flight.id === selected?.return)
    return {
      outbound,
      inbound,
      passengers: search ? search.passengers.adults + search.passengers.children : 1,
      passengerCounts: search
        ? { ...search.passengers, infants: search.passengers.infants ?? 0 }
        : null,
    }
  } catch {
    return { outbound: undefined, inbound: undefined, passengers: 1, passengerCounts: null }
  }
}

export function getTripFlightPrice(): number {
  const { outbound, inbound, passengers } = getTripFlightDetails()
  return ((outbound?.price ?? 0) + (inbound?.price ?? 0)) * passengers
}
