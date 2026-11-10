import { useEffect, useRef, useState } from 'react'
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
  const loaderRef = useRef<HTMLDivElement>(null)

  const visibleFlights = flights.slice(0, visibleCount)
  const hasMoreFlights = visibleCount < flights.length

  function showMoreFlights() {
    setVisibleCount((currentCount) => Math.min(currentCount + FLIGHTS_PER_PAGE, flights.length))
  }

  useEffect(() => {
    const loader = loaderRef.current

    if (!loader || !hasMoreFlights || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisibleCount((currentCount) => Math.min(currentCount + FLIGHTS_PER_PAGE, flights.length))
      }
    })

    observer.observe(loader)

    return () => observer.disconnect()
  }, [hasMoreFlights, flights.length])

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
        <div ref={loaderRef} className="mt-5 flex justify-center">
          <button
            className="flex h-10 cursor-pointer items-center justify-center rounded-xl border border-[#cfd3d8] bg-white px-5 text-sm font-semibold text-text-primary hover:bg-[#f5f6f7]"
            type="button"
            onClick={showMoreFlights}
          >
            Показать ещё
          </button>
        </div>
      )}
    </>
  )
}

export default FlightList
