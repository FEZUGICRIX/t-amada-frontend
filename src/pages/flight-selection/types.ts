export type FlightPoint = {
  city: string
  airport: string
  time: string
}

export type FlightStop = {
  airport: string
  duration: string
}

export type Flight = {
  id: string
  airline: string
  code: string
  departure: FlightPoint
  arrival: FlightPoint
  duration: string
  stops: FlightStop[]
  baggage: string
  travelClass: 'economy' | 'business'
  price: number
}
