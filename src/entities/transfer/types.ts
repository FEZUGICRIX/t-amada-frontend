export type TransferDto = {
  id: string
  model: string
  vehicleClass: 'STANDARD' | 'MINIVAN' | string
  vehicleTypeName: string
  capacity: number
  maxPassengers: number
  baggageCapacityInfo?: string | null
  transferRouteType: 'ONE_WAY' | 'ROUND_TRIP' | string
  price: string
}

export type SearchTransfersParams = {
  pickupLocation?: string
  dropoffLocation?: string
  passengersCount?: number
  routeType?: 'ONE_WAY' | 'ROUND_TRIP'
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price_asc' | 'price_desc' | 'default'
  model?: string
  capacity?: number
}
