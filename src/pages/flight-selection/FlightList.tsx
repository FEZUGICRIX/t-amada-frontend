import { useState } from 'react'
import FlightCard from './FlightCard'
import type { Flight } from './types'

type FlightListProps = {
  flights: Flight[]
  selectedFlightId: string | null
  onSelect: (flightId: string) => void
}

const FLIGHTS_PER_PAGE = 3

function FlightList({ flights, selectedFlightId, onSelect }: FlightListProps) {
  const [visibleCount, setVisibleCount] = useState(FLIGHTS_PER_PAGE)

  const visibleFlights = flights.slice(0, visibleCount)
  const hasMoreFlights = visibleCount < flights.length

  function showMoreFlights() {
    setVisibleCount((currentCount) => Math.min(currentCount + FLIGHTS_PER_PAGE, flights.length))
  }

  return (
    <>
      <div className="flex flex-col gap-2" aria-label="Список рейсов">
        {visibleFlights.map((flight) => (
          <FlightCard
            flight={flight}
            isSelected={flight.id === selectedFlightId}
            onSelect={onSelect}
            key={flight.id}
          />
        ))}
      </div>

      {hasMoreFlights && (
        <button
          className="mx-auto mt-5 flex h-10 cursor-pointer items-center justify-center rounded-xl border border-[#cfd3d8] bg-white px-5 text-sm font-semibold text-text-primary hover:bg-[#f5f6f7]"
          type="button"
          onClick={showMoreFlights}
        >
          Показать ещё
        </button>
      )}
    </>
  )
}

export default FlightList
