export type FlightCity = {
  name: string
  country: string
}

export type FlightCitiesParams = {
  query?: string
  limit?: number
}

export type FlightStop = {
  airport: string
  city?: string
  waitMinutes: number
  utcOffsetMinutes: number
}

export type FlightDto = {
  id: string
  flightNumber: string
  airlineCode: string
  airlineName: string
  departureCity: string
  arrivalCity: string
  departureAirport: string
  arrivalAirport: string
  departureTime: string
  arrivalTime: string
  durationMinutes: number
  departureUtcOffsetMinutes: number
  arrivalUtcOffsetMinutes: number
  flightClass: 'ECONOMY' | 'BUSINESS'
  hasBaggage: boolean
  stopsCount: number
  stops?: FlightStop[]
  availableSeats: number
  price: string
}

export type SearchFlightsParams = {
  origin?: string
  destination?: string
  date?: string
  flightClass?: 'ECONOMY' | 'BUSINESS'
  airlines?: string[]
  hasBaggage?: boolean
  stops?: 'all' | 'direct' | 'with-stops'
  maxStops?: number
  adultsCount?: number
  childrenCount?: number
  minSeats?: number
}
