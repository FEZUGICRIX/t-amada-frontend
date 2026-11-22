import { Link } from '@tanstack/react-router'
import { outboundFlights, returnFlights } from '@/pages/flight-selection/mockFlights'
import {
  getRoomCapacity,
  getTripPassengerCount,
  readRoomSelection,
  resolveSelectedRooms,
} from '@/pages/hotel-selection/roomSelection'

const steps = ['Авиабилет', 'Отель', 'Страховка', 'Трансфер']
const paths = ['/flights', '/hotels', '/insurance', '/transfer'] as const

function BookingSteps({
  current,
  flightsComplete,
}: {
  current: number
  flightsComplete?: boolean
}) {
  let hasSelectedHotel = false
  let incompleteRooms = false
  let hasFlights = false
  try {
    const selectedRooms = resolveSelectedRooms(readRoomSelection())
    hasSelectedHotel =
      selectedRooms.length > 0 && getRoomCapacity(selectedRooms) >= getTripPassengerCount()
    incompleteRooms = selectedRooms.length > 0 && !hasSelectedHotel
    const search = JSON.parse(sessionStorage.getItem('trip-search') || 'null') as {
      isOneWay?: boolean
      passengers?: { travelClass?: string }
    } | null
    const flights = JSON.parse(sessionStorage.getItem('selected-flights') || 'null') as {
      outbound?: string
      return?: string
    } | null
    const outbound = outboundFlights.find((flight) => flight.id === flights?.outbound)
    const inbound = returnFlights.find((flight) => flight.id === flights?.return)
    const travelClass = search?.passengers?.travelClass
    hasFlights = Boolean(
      outbound &&
      (!travelClass || outbound.travelClass === travelClass) &&
      (search?.isOneWay || (inbound && (!travelClass || inbound.travelClass === travelClass))),
    )
  } catch {
    hasSelectedHotel = false
    hasFlights = false
  }
  if (flightsComplete !== undefined) hasFlights = flightsComplete
  return (
    <ol
      className="mt-4 flex list-none flex-wrap items-center gap-2 p-0"
      aria-label="Этапы бронирования"
    >
      {steps.map((step, index) =>
        index === 3 && !hasSelectedHotel ? null : (
          <li
            key={step}
            aria-current={index === current ? 'step' : undefined}
            className={`shrink-0 rounded-full text-[13px] leading-4 ${index === current ? 'bg-accent font-semibold text-text-primary shadow-[0_2px_8px_rgb(255_221_45_/_35%)]' : 'bg-white/80 text-text-secondary'}`}
          >
            {index !== current &&
            (index === 0 ||
              (hasFlights &&
                (!incompleteRooms || index === 1) &&
                (index !== 3 || hasSelectedHotel))) ? (
              <Link
                to={paths[index]}
                className="block rounded-full px-3 py-1.5 text-inherit no-underline hover:bg-white focus-visible:outline-2"
              >
                {index + 1}. {step}
              </Link>
            ) : (
              <span className="block px-3 py-1.5">
                {index + 1}. {step}
              </span>
            )}
          </li>
        ),
      )}
    </ol>
  )
}

export default BookingSteps
