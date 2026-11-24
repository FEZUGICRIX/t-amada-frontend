import { hotels } from '@/pages/hotel-selection/hotels'
import {
  getRoomNightlyTotal,
  readRoomSelection,
  resolveSelectedRooms,
} from '@/pages/hotel-selection/roomSelection'
import { getTripFlightDetails, getTripFlightPrice } from '@/pages/hotel-selection/tripFlightPrice'
import { insurancePlans } from '@/pages/insurance/insurancePlans'
import { getInsurancePassengerCount, getInsurancePrice } from '@/pages/insurance/insurancePrice'
import type { InsuranceSearch } from '@/pages/insurance/insuranceTrip'
import { readHotelNights, readTripPeriod } from '@/shared/tripPeriodData'
import type { Flight } from '@/pages/flight-selection/types'

export function getArrivalDate(
  departureDate: string | null | undefined,
  flight: Flight | undefined,
) {
  if (!departureDate || !flight) return ''
  const date = new Date(`${departureDate}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return ''
  const offset = flight.arrivalDayOffset ?? (flight.arrival.time < flight.departure.time ? 1 : 0)
  date.setUTCDate(date.getUTCDate() + offset)
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
  try {
    search = JSON.parse(sessionStorage.getItem('trip-search') || 'null')
  } catch {
    search = null
  }
  const selection = readRoomSelection()
  const hotel = hotels.find((item) => item.id === selection?.hotelId)
  const rooms = resolveSelectedRooms(selection)
  const insurance = insurancePlans.find(
    (item) => item.id === sessionStorage.getItem('selected-insurance'),
  )
  const passengers = getInsurancePassengerCount(search)
  const nights = readHotelNights()
  const insurancePrice = insurance
    ? getInsurancePrice(insurance.price, readTripPeriod('insurance-period', search), search)
    : null
  return {
    search,
    hotel,
    rooms,
    insurance,
    ...getTripFlightDetails(),
    passengers,
    nights,
    insurancePrice,
    total:
      getTripFlightPrice() + getRoomNightlyTotal(rooms) * (nights ?? 0) + (insurancePrice ?? 0),
  }
}

export function formatTransferDate(value?: string | null) {
  if (!value) return 'Дата не выбрана'
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? 'Дата не выбрана'
    : date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}
