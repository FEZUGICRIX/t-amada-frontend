import { hotels } from '@/pages/hotel-selection/hotels'
import { getRoomsForHotel } from '@/pages/hotel-selection/rooms'
import { getTripFlightDetails, getTripFlightPrice } from '@/pages/hotel-selection/tripFlightPrice'
import { insurancePlans } from '@/pages/insurance/insurancePlans'
import { getInsurancePassengerCount } from '@/pages/insurance/insurancePrice'
import type { InsuranceSearch } from '@/pages/insurance/insuranceTrip'
import { readHotelNights } from '@/shared/tripPeriodData'

export function readTransferTrip() {
  let search: InsuranceSearch
  let selection: { hotelId?: string; roomId?: string } | null
  try {
    search = JSON.parse(sessionStorage.getItem('trip-search') || 'null')
    selection = JSON.parse(sessionStorage.getItem('selected-room') || 'null')
  } catch {
    search = null
    selection = null
  }
  const hotel = hotels.find((item) => item.id === selection?.hotelId)
  const room = hotel
    ? getRoomsForHotel(hotel.price).find((item) => item.id === selection?.roomId)
    : undefined
  const insurance = insurancePlans.find(
    (item) => item.id === sessionStorage.getItem('selected-insurance'),
  )
  const passengers = getInsurancePassengerCount(search)
  const nights = readHotelNights()
  return {
    search,
    hotel,
    room,
    insurance,
    ...getTripFlightDetails(),
    passengers,
    nights,
    total:
      getTripFlightPrice() +
      (room?.price ?? 0) * (nights ?? 0) +
      (insurance?.price ?? 0) * passengers,
  }
}

export function formatTransferDate(value?: string | null) {
  if (!value) return 'Дата не выбрана'
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? 'Дата не выбрана'
    : date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}
