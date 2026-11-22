import type { Flight } from './types'
import CardPrice from '@/shared/CardPrice'
import FlightTimeline, { FlightTrack } from './FlightTimeline'

type FlightCardProps = {
  flight: Flight
  isSelected: boolean
  onSelect: (flightId: string) => void
  groupPrice?: boolean
  payingPassengers?: number
  date?: string | null
}

function getStopsLabel(stopsCount: number) {
  if (stopsCount === 0) {
    return 'прямой рейс'
  }

  const form = new Intl.PluralRules('ru-RU').select(stopsCount)
  return `${stopsCount} ${form === 'one' ? 'пересадка' : form === 'few' ? 'пересадки' : 'пересадок'}`
}

function FlightCard({
  flight,
  isSelected,
  onSelect,
  groupPrice = false,
  payingPassengers = 1,
  date,
}: FlightCardProps) {
  const className = flight.travelClass === 'economy' ? 'эконом' : 'бизнес'

  const baggageLabel = flight.baggage === 'без багажа' ? flight.baggage : `багаж ${flight.baggage}`

  return (
    <article
      className={`grid cursor-pointer grid-cols-[44px_minmax(0,1fr)] gap-x-3 rounded-xl bg-white p-4 transition-shadow hover:shadow-sm md:grid-cols-[44px_minmax(0,1fr)_auto] md:gap-x-4 ${
        isSelected ? 'border-2 border-text-primary' : 'border border-[#e1e4e8]'
      }`}
      aria-label={`Рейс ${flight.airline}`}
      onClick={() => onSelect(flight.id)}
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
        <h3 className="break-words text-base leading-5 font-semibold">{flight.airline}</h3>

        <div className="mt-1 grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3">
          <div className="col-start-1 row-start-1">
            <strong className="text-lg leading-6">{flight.departure.time}</strong>

            <p className="text-[11px] leading-4 text-text-secondary">
              {flight.departure.city}, {flight.departure.airport}
            </p>
          </div>

          <div className="col-start-2 row-start-1 flex min-w-0 flex-col items-center pt-3">
            {!flight.stops.length && (
              <>
                <span
                  className="relative h-px w-full bg-[#aeb4bd] after:absolute after:top-1/2 after:right-0 after:size-1 after:-translate-y-1/2 after:rounded-full after:bg-[#7d858f] after:content-['']"
                  aria-hidden="true"
                />
                <span className="mt-1 text-[10px] leading-3 text-text-secondary">
                  {flight.duration}
                </span>
              </>
            )}
          </div>

          <div className="col-start-3 row-start-1 text-right">
            <strong className="text-lg leading-6">{flight.arrival.time}</strong>

            <p className="text-[11px] leading-4 text-text-secondary">
              {flight.arrival.city}, {flight.arrival.airport}
            </p>
            {flight.arrivalDayOffset != null && flight.arrivalDayOffset > 0 && (
              <p className="text-[11px] leading-4 text-text-secondary">
                {flight.arrivalDayOffset === 1 ? '+1 день' : `+${flight.arrivalDayOffset} дней`}
              </p>
            )}
          </div>
          {flight.stops.length > 0 && <FlightTrack flight={flight} />}
        </div>

        <div className="mt-2 flex flex-wrap gap-x-2 text-xs leading-4 text-text-secondary">
          <span>{getStopsLabel(flight.stops.length)}</span>
          <span aria-hidden="true">·</span>
          <span>{baggageLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{className}</span>
        </div>

        {flight.stops.length > 0 && <FlightTimeline flight={flight} date={date} />}
      </div>

      <div className="col-span-2 mt-3 flex items-end justify-between gap-3 border-t border-[#e1e4e8] pt-3 md:col-span-1 md:mt-0 md:min-w-[130px] md:flex-col md:items-end md:gap-3 md:border-0 md:pt-0">
        <CardPrice
          price={flight.price}
          unit={groupPrice ? 'за билет' : 'за 1 билет'}
          total={payingPassengers > 1 ? flight.price * payingPassengers : null}
          totalLabel="за всех"
          align="left"
        />

        <button
          className={`h-9 cursor-pointer rounded-xl border-0 px-4 text-[13px] font-semibold text-text-primary transition-colors hover:brightness-95 active:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary ${
            isSelected ? 'bg-accent' : 'bg-[#e7e9ec]'
          }`}
          type="button"
          aria-pressed={isSelected}
          onClick={(event) => {
            event.stopPropagation()
            onSelect(flight.id)
          }}
        >
          {isSelected ? 'Выбрано' : 'Выбрать'}
        </button>
      </div>
    </article>
  )
}

export default FlightCard
