export type InsuranceDto = {
  id: string
  title: string
  planType: 'BASIC' | 'EXTENDED' | string
  coverageAmount: string
  coveredRisks: string[]
  exclusions?: string | null
  price: string
  basePrice?: string
  totalPrice?: string
  passengersCount?: number
}

export type SearchInsurancesParams = {
  planType?: 'BASIC' | 'EXTENDED'
  passengersCount?: number
  title?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price_asc' | 'price_desc' | 'default'
}
