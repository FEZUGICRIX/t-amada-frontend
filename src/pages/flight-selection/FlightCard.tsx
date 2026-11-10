import type { Flight } from './types'
import formatPrice from './formatPrice'

type FlightCardProps = {
  flight: Flight
  isSelected: boolean
  onSelect: (flightId: string) => void
}

function getStopsLabel(stopsCount: number) {
  if (stopsCount === 0) {
    return 'прямой рейс'
  }

  if (stopsCount === 1) {
    return '1 пересадка'
  }

  return `${stopsCount} пересадки`
}

function FlightCard({ flight, isSelected, onSelect }: FlightCardProps) {
  const className = flight.travelClass === 'economy' ? 'эконом' : 'бизнес'

  const baggageLabel = flight.baggage === 'без багажа' ? flight.baggage : `багаж ${flight.baggage}`

  return (
    <article
      className={`grid grid-cols-[44px_minmax(0,1fr)] gap-x-3 rounded-xl bg-white p-4 md:grid-cols-[44px_minmax(0,1fr)_auto] md:gap-x-4 ${
        isSelected ? 'border-2 border-text-primary' : 'border border-[#e1e4e8]'
      }`}
      aria-label={`Рейс ${flight.airline}`}
    >
      <div
        className={`grid size-11 place-items-center rounded-lg border border-[#e1e4e8] text-[13px] font-semibold ${
          flight.code === 'DP' ? 'text-[#7a32c7]' : 'text-[#1769c2]'
        }`}
        aria-hidden="true"
      >
        {flight.code}
      </div>

      <div className="min-w-0">
        <h3 className="truncate text-base leading-5 font-semibold">{flight.airline}</h3>

        <div className="mt-1 flex items-start gap-3">
          <div>
            <strong className="text-lg leading-6">{flight.departure.time}</strong>

            <p className="text-[11px] leading-4 text-text-secondary">
              {flight.departure.city}, {flight.departure.airport}
            </p>
          </div>

          <div className="flex min-w-12 flex-1 flex-col items-center pt-3">
            <span
              className="relative h-px w-full bg-[#aeb4bd] after:absolute after:top-1/2 after:right-0 after:size-1 after:-translate-y-1/2 after:rounded-full after:bg-[#7d858f] after:content-['']"
              aria-hidden="true"
            />

            <span className="mt-1 text-[10px] leading-3 text-text-secondary">
              {flight.duration}
            </span>
          </div>

          <div className="text-right">
            <strong className="text-lg leading-6">{flight.arrival.time}</strong>

            <p className="text-[11px] leading-4 text-text-secondary">
              {flight.arrival.city}, {flight.arrival.airport}
            </p>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-2 text-xs leading-4 text-text-secondary">
          <span>{getStopsLabel(flight.stops.length)}</span>
          <span aria-hidden="true">·</span>
          <span>{baggageLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{className}</span>
        </div>

        {flight.stops.map((stop) => (
          <div
            className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-[#f2f3f4] px-2.5 py-1.5 text-[11px] leading-4"
            key={stop.airport}
          >
            <span>{stop.airport}</span>
            <strong>{stop.duration}</strong>
          </div>
        ))}
      </div>

      <div className="col-span-2 mt-3 flex items-end justify-between gap-3 border-t border-[#e1e4e8] pt-3 md:col-span-1 md:mt-0 md:min-w-[130px] md:flex-col md:items-end md:gap-3 md:border-0 md:pt-0">
        <strong className="text-lg leading-6">{formatPrice(flight.price)}</strong>

        <button
          className={`h-9 cursor-pointer rounded-xl border-0 px-4 text-[13px] font-semibold text-text-primary ${
            isSelected ? 'bg-accent' : 'bg-[#e7e9ec]'
          }`}
          type="button"
          aria-pressed={isSelected}
          onClick={() => onSelect(flight.id)}
        >
          {isSelected ? 'Выбрано' : 'Выбрать'}
        </button>
      </div>
    </article>
  )
}

export default FlightCard
