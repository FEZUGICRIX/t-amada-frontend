import type { InsuranceSearch } from './insuranceTrip'

export function getInsurancePassengerCount(search: InsuranceSearch): number {
  if (!search?.passengers) return 1
  const { adults = 0, children = 0, infants = 0 } = search.passengers
  return adults + children + infants
}
