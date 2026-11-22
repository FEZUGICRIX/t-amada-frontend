export type FlightPoint = {
  city: string
  airport: string
  time: string
}

export type FlightStop = {
  airport: string
  duration: string
  city?: string
  waitMinutes?: number
  utcOffsetMinutes?: number
}

export type Flight = {
  id: string
  airline: string
  code: string
  departure: FlightPoint
  arrival: FlightPoint
  duration: string
  stops: FlightStop[]
  segmentMinutes?: number[]
  departureUtcOffsetMinutes?: number
  arrivalDayOffset?: number
  baggage: string
  travelClass: 'economy' | 'business'
  price: number
}
