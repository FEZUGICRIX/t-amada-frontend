import type { Flight } from './types'
import { formatConnectionDate, getConnectionTimes } from './connectionTimes'

function formatMinutes(value: number) {
  const hours = Math.floor(value / 60)
  const minutes = value % 60
  return (
    [hours ? `${hours} ч` : '', minutes ? `${minutes} мин` : ''].filter(Boolean).join(' ') ||
    '0 мин'
  )
}

function getTimelineParts(flight: Flight) {
  if (
    !flight.segmentMinutes ||
    flight.segmentMinutes.length !== flight.stops.length + 1 ||
    flight.segmentMinutes.some((minutes) => !Number.isFinite(minutes) || minutes <= 0) ||
    flight.stops.some((stop) => !Number.isFinite(stop.waitMinutes) || (stop.waitMinutes ?? 0) <= 0)
  )
    return null
  const parts: { kind: 'flight' | 'stop'; minutes: number }[] = []
  flight.segmentMinutes.forEach((minutes, index) => {
    parts.push({ kind: 'flight', minutes })
    if (flight.stops[index]) parts.push({ kind: 'stop', minutes: flight.stops[index].waitMinutes! })
  })
  return parts
}

function FlightTimeline({ flight, date }: { flight: Flight; date?: string | null }) {
  const parts = getTimelineParts(flight)
  const times = getConnectionTimes(flight)
  return (
    <div className="mt-3" aria-label="Маршрут с пересадками">
      <p className="mb-2 text-xs text-text-secondary">Время местное для каждого аэропорта</p>
      <div className="divide-y divide-[#e1e4e8] rounded-xl bg-[#f5f6f7] px-3">
        {flight.stops.map((stop, index) => (
          <div key={`${stop.airport}-${index}`} className="py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <p className="text-xs font-semibold leading-5">
                {flight.stops.length > 1 ? `${index + 1}. ` : ''}Пересадка:{' '}
                {stop.city ? `${stop.city}, ` : ''}
                {stop.airport}
              </p>
              <span className="rounded-md bg-[#fff2b3] px-2 py-1 text-xs font-semibold">
                Ожидание {stop.duration}
              </span>
            </div>
            {times[index] ? (
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs leading-5">
                <p>
                  <span className="text-text-secondary">Прилёт </span>
                  <strong>{times[index]!.arrival.time}</strong>
                  {formatConnectionDate(date, times[index]!.arrival.dayOffset) &&
                    ` · ${formatConnectionDate(date, times[index]!.arrival.dayOffset)}`}
                </p>
                <p>
                  <span className="text-text-secondary">Следующий вылет </span>
                  <strong>{times[index]!.departure.time}</strong>
                  {formatConnectionDate(date, times[index]!.departure.dayOffset) &&
                    ` · ${formatConnectionDate(date, times[index]!.departure.dayOffset)}`}
                </p>
              </div>
            ) : (
              <p className="mt-1 text-xs leading-5 text-text-secondary">
                Время прилёта и следующего вылета уточняется
              </p>
            )}
          </div>
        ))}
      </div>
      {parts && (
        <p className="mt-2 text-xs leading-5 text-text-secondary">
          В полёте{' '}
          {formatMinutes(
            parts
              .filter((part) => part.kind === 'flight')
              .reduce((sum, part) => sum + part.minutes, 0),
          )}
          {' · '}На пересадки{' '}
          {formatMinutes(
            parts
              .filter((part) => part.kind === 'stop')
              .reduce((sum, part) => sum + part.minutes, 0),
          )}
          {' · '}Всего {flight.duration}
        </p>
      )}
      {!parts && (
        <p className="mt-2 text-xs leading-5 text-text-secondary">
          Длительность отдельных перелётов не указана
        </p>
      )}
    </div>
  )
}

export function FlightTrack({ flight }: { flight: Flight }) {
  const parts = getTimelineParts(flight)
  const displayParts =
    parts ??
    flight.stops
      .flatMap(() => [
        { kind: 'flight' as const, minutes: 1 },
        { kind: 'stop' as const, minutes: 1 },
      ])
      .concat({ kind: 'flight', minutes: 1 })
  return (
    <div
      className="col-span-3 row-start-2 mt-2 min-w-0 overflow-x-auto pt-5 pb-1 md:col-span-1 md:col-start-2 md:row-start-1 md:mt-0 md:pt-[18px]"
      aria-label="Схема пересадок"
    >
      <div className="flex min-w-[190px] items-center" aria-hidden="true">
        {displayParts.map((part, index) =>
          part.kind === 'flight' ? (
            <span
              key={index}
              style={{ flexGrow: part.minutes, flexBasis: 0 }}
              className="h-px min-w-2 bg-[#aeb4bd]"
            />
          ) : (
            <span
              key={index}
              style={{ flexGrow: part.minutes, flexBasis: 0 }}
              className="relative h-[3px] min-w-12 rounded-full bg-[#f2d14b]"
            >
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] leading-4 text-text-secondary">
                {flight.stops[(index - 1) / 2]?.duration}
              </span>
              <span className="absolute top-1/2 left-0 size-1.5 -translate-y-1/2 rounded-full bg-[#aeb4bd]" />
              <span className="absolute top-1/2 right-0 size-1.5 -translate-y-1/2 rounded-full bg-[#aeb4bd]" />
            </span>
          ),
        )}
      </div>
      <p className="mt-1 text-center text-[10px] leading-3 text-text-secondary">
        {flight.duration}
      </p>
      <span className="sr-only">
        На выделенных участках показано время между прилётом и следующим вылетом.
      </span>
    </div>
  )
}

export default FlightTimeline
