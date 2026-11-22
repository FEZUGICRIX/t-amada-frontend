import { hotels } from '@/pages/hotel-selection/hotels'
import { getRoomsForHotel } from '@/pages/hotel-selection/rooms'
import { getTripFlightDetails, getTripFlightPrice } from '@/pages/hotel-selection/tripFlightPrice'
import { insurancePlans } from '@/pages/insurance/insurancePlans'
import { getInsurancePassengerCount } from '@/pages/insurance/insurancePrice'
import type { InsuranceSearch } from '@/pages/insurance/insuranceTrip'
import { readHotelNights } from '@/shared/tripPeriodData'
import type { Flight } from '@/pages/flight-selection/types'

export function getArrivalDate(
  departureDate: string | null | undefined,
  flight: Flight | undefined,
) {
  if (!departureDate || !flight) return ''
  const date = new Date(`${departureDate}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return ''
  if (flight.arrival.time < flight.departure.time) date.setUTCDate(date.getUTCDate() + 1)
  return date.toISOString().slice(0, 10)
}

export function getDefaultPickupTime(arrivalTime: string | undefined) {
  if (!arrivalTime || !/^([01]\d|2[0-3]):[0-5]\d$/.test(arrivalTime)) return ''
  const [hours, minutes] = arrivalTime.split(':').map(Number)
  if (hours >= 22) return ''
  return `${String(hours + 2).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function getDefaultReturnTime(departureTime: string | undefined) {
  if (!departureTime || !/^([01]\d|2[0-3]):[0-5]\d$/.test(departureTime)) return ''
  const [hours, minutes] = departureTime.split(':').map(Number)
  if (hours < 4) return ''
  return `${String(hours - 4).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

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
