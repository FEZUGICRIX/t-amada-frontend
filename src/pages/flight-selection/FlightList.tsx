import { useEffect, useRef, useState } from 'react'
import FlightCard from './FlightCard'
import type { Flight } from './types'

type FlightListProps = {
  flights: Flight[]
  selectedFlightId: string | null
  onSelect: (flightId: string) => void
  isLoading?: boolean
  groupPrice?: boolean
}

const FLIGHTS_PER_PAGE = 3

function FlightList({
  flights,
  selectedFlightId,
  onSelect,
  isLoading = false,
  groupPrice = false,
}: FlightListProps) {
  const [visibleCount, setVisibleCount] = useState(FLIGHTS_PER_PAGE)
  const loaderRef = useRef<HTMLDivElement>(null)

  const visibleFlights = flights.slice(0, visibleCount)
  const hasMoreFlights = visibleCount < flights.length

  function showMoreFlights() {
    setVisibleCount((currentCount) => Math.min(currentCount + FLIGHTS_PER_PAGE, flights.length))
  }

  useEffect(() => {
    const loader = loaderRef.current

    if (isLoading || !loader || !hasMoreFlights || typeof IntersectionObserver === 'undefined')
      return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisibleCount((currentCount) => Math.min(currentCount + FLIGHTS_PER_PAGE, flights.length))
      }
    })

    observer.observe(loader)

    return () => observer.disconnect()
  }, [hasMoreFlights, flights.length, isLoading])

  if (isLoading) {
    return (
      <div role="status" aria-label="Загрузка рейсов" className="flex flex-col gap-2">
        <span className="sr-only">Загрузка рейсов</span>
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            aria-hidden="true"
            className="flex min-h-28 items-center gap-4 rounded-xl border border-[#e1e4e8] bg-white p-4 motion-safe:animate-pulse"
          >
            <div className="size-11 shrink-0 rounded-lg bg-[#e7e9ec]" />
            <div className="flex flex-1 flex-col gap-3">
              <div className="h-4 w-1/3 rounded bg-[#e7e9ec]" />
              <div className="h-4 w-2/3 rounded bg-[#e7e9ec]" />
              <div className="h-3 w-1/2 rounded bg-[#e7e9ec]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2" aria-label="Список рейсов">
        {visibleFlights.map((flight) => (
          <FlightCard
            flight={flight}
            isSelected={flight.id === selectedFlightId}
            onSelect={onSelect}
            groupPrice={groupPrice}
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
