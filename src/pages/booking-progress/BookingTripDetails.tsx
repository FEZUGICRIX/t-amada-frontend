import { useEffect, useRef, useState } from 'react'
import type { BookingService, BookingTrip } from './bookingData'
import type { Flight } from '@/pages/flight-selection/types'
import { formatTransferDate, getArrivalDate } from '@/pages/transfer/transferTrip'
import { formatFlightPassengers } from '@/shared/flightPriceDescription'

function FlightDetails({
  flight,
  date,
  label,
}: {
  flight: Flight
  date: string | null
  label: string
}) {
  const arrivalDate = getArrivalDate(date, flight)
  return (
    <div className="mt-3 min-w-0 rounded-2xl border border-[#eceef0] bg-[#fafbfc] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-text-primary">
          {label} · {flight.departure.city} → {flight.arrival.city}
        </p>
        <span className="rounded-full bg-[#fff2bf] px-2.5 py-1 text-xs font-semibold text-[#765b00]">
          {flight.duration}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_minmax(32px,0.7fr)_minmax(0,1fr)] items-start gap-2">
        <div className="min-w-0">
          <p className="text-lg font-semibold leading-6 text-text-primary">
            {flight.departure.time} · {flight.departure.airport}
          </p>
          <p className="mt-1 text-xs text-text-secondary">Вылет · {formatTransferDate(date)}</p>
        </div>
        <div aria-hidden="true" className="mt-3 flex items-center">
          <span className="size-1.5 shrink-0 rounded-full bg-[#a9afb7]" />
          <span className="h-px w-full bg-[#cdd2d8]" />
          <span className="size-1.5 shrink-0 rounded-full bg-[#a9afb7]" />
        </div>
        <div className="min-w-0 text-right">
          <p className="text-lg font-semibold leading-6 text-text-primary">
            {flight.arrival.time} · {flight.arrival.airport}
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            Прилёт · {formatTransferDate(arrivalDate)}
          </p>
        </div>
      </div>
      <div className="mt-4 border-t border-[#e7e9ec] pt-3">
        <p className="inline-block rounded-lg bg-white px-2.5 py-1 text-xs leading-5 text-text-secondary ring-1 ring-[#e7e9ec]">
          {flight.stops.length
            ? `Пересадки: ${flight.stops.map((stop) => [stop.city, stop.airport, stop.duration].filter(Boolean).join(' · ')).join('; ')}`
            : 'Прямой рейс'}
        </p>
      </div>
    </div>
  )
}

function BookingTripDetails({ trip, service }: { trip?: BookingTrip; service: BookingService }) {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => {
      if (dialog?.open) dialog.close()
    }
  }, [open])
  if (!trip) return null
  const plural =
    new Intl.PluralRules('ru-RU').select(trip.passengers) === 'few' ? 'человека' : 'человек'
  const passengers = trip.passengerCounts
    ? formatFlightPassengers(trip.passengerCounts)
    : `${trip.passengers} ${plural}`
  const details =
    service.id === 'hotel'
      ? trip.hotelName
      : service.id === 'insurance'
        ? trip.insuranceName
        : service.id === 'transfer'
          ? trip.transferName
            ? `${trip.transferName}${trip.transferRoundTrip ? ' · туда и обратно' : ' · в отель'}`
            : undefined
          : undefined
  const short =
    service.id === 'flight'
      ? [trip.origin && trip.destination ? `${trip.origin} → ${trip.destination}` : '', passengers]
          .filter(Boolean)
          .join(' · ')
      : details
  return (
    <div className="mt-1 min-w-0">
      {short && <p className="line-clamp-2 text-xs leading-5 text-text-secondary">{short}</p>}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Подробнее: ${service.name}`}
        className="mt-1 cursor-pointer text-xs font-semibold text-text-primary underline underline-offset-2 hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Подробнее
      </button>
      {open && (
        <dialog
          ref={dialogRef}
          onClose={() => setOpen(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) dialogRef.current?.close()
          }}
          aria-labelledby={`details-${service.id}`}
          className="m-auto max-h-[90dvh] w-[calc(100%-32px)] max-w-[560px] overflow-y-auto rounded-2xl bg-white p-5 text-text-primary shadow-xl backdrop:bg-black/40 sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={`details-${service.id}`} className="text-xl font-semibold">
                {service.name}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">Подробности услуги</p>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Закрыть"
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f1f2f3] text-xl hover:bg-[#e7e9ec]"
            >
              ×
            </button>
          </div>
          <div className="mt-4 text-sm leading-6 text-text-secondary">
            {service.id === 'flight' ? (
              <>
                <div className="inline-flex items-center gap-2 rounded-lg bg-[#fff8dc] px-3 py-2 text-xs font-medium text-[#765b00]">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="size-4"
                  >
                    <circle cx="9" cy="8" r="3" />
                    <path
                      d="M3.5 19v-1a5.5 5.5 0 0 1 11 0v1M16 5.5a3 3 0 0 1 0 5.8M17 13a5 5 0 0 1 3.5 4.8V19"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>{passengers}</span>
                </div>
                {trip.outbound && (
                  <FlightDetails flight={trip.outbound} date={trip.departureDate} label="Туда" />
                )}
                {trip.inbound && (
                  <FlightDetails flight={trip.inbound} date={trip.returnDate} label="Обратно" />
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-[#eceef0] bg-[#fafbfc] p-4">
                <span className="text-xs font-medium text-text-secondary">Выбранный вариант</span>
                <p className="mt-1 font-semibold text-text-primary">
                  {details || 'Подробности услуги пока недоступны.'}
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="mt-5 min-h-11 w-full rounded-xl bg-accent px-4 text-sm font-semibold text-text-primary hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Закрыть
          </button>
        </dialog>
      )}
    </div>
  )
}
export default BookingTripDetails
