import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import BookingSteps from '@/shared/BookingSteps'
import {
  FlightPriceRow,
  HotelRoomsPriceRow,
  InsurancePriceRow,
  TransferPriceRow,
} from '@/shared/TripPriceRows'
import formatPrice from '@/pages/flight-selection/formatPrice'
import TransferCard from './TransferCard'
import { transferOptions } from './transferOptions'
import {
  formatTransferDate,
  getArrivalDate,
  getDefaultPickupTime,
  getDefaultReturnTime,
  readTransferTrip,
} from './transferTrip'
import TransferDateField from './TransferDateField'
import TransferTimeField from './TransferTimeField'
import { clearTransfer, readTransferSelection } from './transferSelection'
import SkipStepButton from '@/shared/SkipStepButton'

function TransferPage() {
  const summaryRef = useRef<HTMLElement>(null)
  const [summaryHeight, setSummaryHeight] = useState(0)
  useEffect(() => {
    const element = summaryRef.current
    if (!element) return
    const updateHeight = () => setSummaryHeight(element.getBoundingClientRect().height)
    updateHeight()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(updateHeight)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  const navigate = useNavigate()
  const [trip] = useState(readTransferTrip)
  const arrivalDate = getArrivalDate(trip.search?.departureDate, trip.outbound)
  const flightKey = JSON.stringify([
    trip.outbound?.id,
    trip.inbound?.id,
    trip.search?.departureDate,
    trip.search?.returnDate,
  ])
  const [initialSelection] = useState(() =>
    readTransferSelection(trip.hotel?.id, trip.passengers, flightKey),
  )
  const [roundTrip, setRoundTrip] = useState(initialSelection.selection?.roundTrip ?? false)
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelection.selection?.optionId ?? null,
  )
  const [selectionNotice, setSelectionNotice] = useState(initialSelection.invalid)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [schedule, setSchedule] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('transfer-schedule') || 'null')
      if (
        saved &&
        saved.hotelId === trip.hotel?.id &&
        saved?.outboundFlight === trip.outbound?.id &&
        saved?.inboundFlight === trip.inbound?.id &&
        saved?.departureDate === trip.search?.departureDate &&
        saved?.flightReturnDate === trip.search?.returnDate
      )
        return {
          ...saved,
          outboundDate: arrivalDate || saved.outboundDate,
          outboundTime: saved.outboundTime || getDefaultPickupTime(trip.outbound?.arrival.time),
          returnDate: trip.inbound ? (trip.search?.returnDate ?? '') : saved.returnDate,
          returnTime: saved.returnTime || getDefaultReturnTime(trip.inbound?.departure.time),
        }
    } catch {
      sessionStorage.removeItem('transfer-schedule')
    }
    return {
      hotelId: trip.hotel?.id,
      outboundFlight: trip.outbound?.id,
      inboundFlight: trip.inbound?.id,
      departureDate: trip.search?.departureDate,
      flightReturnDate: trip.search?.returnDate,
      outboundDate: arrivalDate || trip.search?.departureDate || '',
      outboundTime: getDefaultPickupTime(trip.outbound?.arrival.time),
      returnDate: trip.search?.isOneWay ? '' : (trip.search?.returnDate ?? ''),
      returnTime: getDefaultReturnTime(trip.inbound?.departure.time),
    }
  })
  const [draft, setDraft] = useState(schedule)
  const selected = transferOptions.find((option) => option.id === selectedId)
  const airport = trip.outbound
    ? `Аэропорт ${trip.outbound.arrival.city}, ${trip.outbound.arrival.airport}`
    : 'Аэропорт не выбран'
  const hotel = trip.hotel?.name ?? 'Отель не выбран'
  const rows = (
    <>
      <FlightPriceRow />
      {trip.rooms.length > 0 && <HotelRoomsPriceRow rooms={trip.rooms} nights={trip.nights} />}
      {trip.insurance && <InsurancePriceRow total={trip.insurancePrice} />}
      {selected && <TransferPriceRow price={selected.price} trips={roundTrip ? 2 : 1} />}
    </>
  )
  return (
    <section className="relative isolate min-h-[calc(100vh-80px)] pt-6 pb-4 md:pt-8 lg:pt-10 lg:pb-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden"
      >
        <svg
          className="absolute bottom-0 left-0 h-[min(42vh,380px)] w-full"
          viewBox="0 0 1440 380"
          preserveAspectRatio="xMidYMax slice"
          fill="none"
        >
          <circle cx="1180" cy="82" r="42" fill="#f7df8b" />
          <path
            d="M0 225 180 120 315 210 480 105 655 238 835 132 1005 230 1170 120 1440 240V380H0Z"
            fill="#f3ecd9"
          />
          <path d="M0 282C190 223 329 239 492 281s331 39 488-2 301-51 460 2v99H0Z" fill="#dfe9e2" />
          <path d="M-120 380C205 301 485 320 708 380h250c-318-88-616-111-1003-38Z" fill="#cad8d3" />
          <path
            d="M32 362c215-47 415-45 592 0"
            stroke="#fffdf5"
            strokeWidth="3"
            strokeDasharray="20 16"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <Link
        to="/insurance"
        className="mb-4 inline-flex h-10 items-center rounded-xl border border-[#cfd3d8] px-4 text-sm font-semibold text-text-primary no-underline hover:bg-[#f5f6f7]"
      >
        Назад
      </Link>
      <header className="rounded-2xl bg-[radial-gradient(circle_at_90%_0%,rgb(255_221_45_/_22%),transparent_42%),linear-gradient(120deg,#fffdf8,#fff9e4)] p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[22px] leading-7 font-semibold md:text-[28px] md:leading-9 lg:text-[34px] lg:leading-10">
            Выберите трансфер
          </h1>
          <SkipStepButton
            onClick={() => {
              setSelectedId(null)
              clearTransfer()
              void navigate({ to: '/passengers' })
            }}
          />
        </div>
        <p className="mt-2 text-sm text-text-secondary">Из аэропорта до отеля и обратно</p>
        <BookingSteps current={3} />
      </header>
      <div
        role="group"
        aria-label="Направления трансфера"
        className="mt-6 flex w-fit max-w-full flex-wrap items-stretch gap-x-5"
      >
        {[
          { label: 'Только из аэропорта', value: false },
          { label: 'Из аэропорта и обратно', value: true },
        ].map(({ label, value }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            aria-pressed={roundTrip === value}
            onClick={() => {
              setRoundTrip(value)
              if (selectedId && trip.hotel)
                sessionStorage.setItem(
                  'selected-transfer',
                  JSON.stringify({
                    optionId: selectedId,
                    roundTrip: value,
                    hotelId: trip.hotel.id,
                    flightKey,
                  }),
                )
            }}
            className={`relative inline-flex min-h-12 cursor-pointer items-center gap-2.5 border-b border-[#e1e4e8] px-1 py-3 text-left text-sm leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary ${roundTrip === value ? 'font-semibold text-text-primary after:absolute after:inset-x-0 after:-bottom-px after:h-[3px] after:rounded-full after:bg-accent' : 'font-medium text-text-secondary hover:text-text-primary'}`}
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              {value ? (
                <>
                  <path d="M4 8h15m-4-4 4 4-4 4" />
                  <path d="M20 16H5m4-4-4 4 4 4" />
                </>
              ) : (
                <path d="M4 12h15m-4-4 4 4-4 4" />
              )}
            </svg>
            <span>{label}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
        <div className="min-w-0 space-y-3">
          <section
            aria-label="Маршрут трансфера"
            className="flex flex-col items-stretch justify-between gap-3 rounded-xl border border-[#cfd3d8] p-4 md:flex-row md:items-center"
          >
            <div className="min-w-0 flex-1 space-y-3">
              <div className="rounded-xl bg-[#f7f8f9] p-3">
                <span className="mb-2 inline-block rounded-md bg-[#fff0a6] px-2 py-1 text-xs font-semibold">
                  В отель
                </span>
                <h2 className="text-sm font-semibold [overflow-wrap:anywhere]">
                  {airport} → {hotel}
                </h2>
                {trip.hotel && (
                  <p className="mt-1 text-xs text-text-secondary">
                    Адрес отеля: {trip.hotel.address}
                  </p>
                )}
                <p className="mt-2 text-sm font-medium leading-5 text-text-primary">
                  Подача: {formatTransferDate(schedule.outboundDate)}
                  {schedule.outboundTime ? `, ${schedule.outboundTime}` : ', время не выбрано'}
                </p>
              </div>
              {roundTrip && (
                <div className="rounded-xl bg-[#f7f8f9] p-3">
                  <span className="mb-2 inline-block rounded-md bg-[#fff0a6] px-2 py-1 text-xs font-semibold">
                    В аэропорт
                  </span>
                  <h2 className="text-sm font-semibold [overflow-wrap:anywhere]">
                    {hotel} →{' '}
                    {trip.inbound
                      ? `Аэропорт ${trip.inbound.departure.city}, ${trip.inbound.departure.airport}`
                      : airport}
                  </h2>
                  {trip.hotel && (
                    <p className="mt-1 text-xs text-text-secondary">
                      Адрес отеля: {trip.hotel.address}
                    </p>
                  )}
                  <p className="mt-2 text-sm font-medium leading-5 text-text-primary">
                    Подача: {formatTransferDate(schedule.returnDate)}
                    {schedule.returnTime ? `, ${schedule.returnTime}` : ', время не выбрано'}
                  </p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setDraft(schedule)
                setError('')
                setEditing(true)
              }}
              className="h-9 shrink-0 cursor-pointer self-end rounded-xl border border-[#cfd3d8] px-4 text-sm font-semibold hover:bg-[#f2f3f4] focus-visible:outline-2 md:self-center"
            >
              Изменить
            </button>
          </section>
          {editing && (
            <form
              aria-label="Изменение времени трансфера"
              className="space-y-4 rounded-xl border border-[#cfd3d8] bg-white p-4"
              onSubmit={(event) => {
                event.preventDefault()
                if (
                  !draft.outboundDate ||
                  !draft.outboundTime ||
                  (roundTrip && (!draft.returnDate || !draft.returnTime))
                ) {
                  setError('Укажите дату и время для каждого направления')
                  return
                }
                const validTime = /^([01]\d|2[0-3]):[0-5]\d$/
                if (
                  !validTime.test(draft.outboundTime) ||
                  (roundTrip && !validTime.test(draft.returnTime))
                ) {
                  setError('Укажите корректное время в формате ЧЧ:ММ')
                  return
                }
                if (
                  roundTrip &&
                  `${draft.returnDate}T${draft.returnTime}` <=
                    `${draft.outboundDate}T${draft.outboundTime}`
                ) {
                  setError('Обратный трансфер должен быть позже трансфера в отель')
                  return
                }
                if (
                  trip.outbound &&
                  arrivalDate &&
                  `${draft.outboundDate}T${draft.outboundTime}` <
                    `${arrivalDate}T${trip.outbound.arrival.time}`
                ) {
                  setError('Трансфер в отель не может быть раньше прилёта')
                  return
                }
                if (
                  roundTrip &&
                  trip.inbound &&
                  trip.search?.returnDate &&
                  `${draft.returnDate}T${draft.returnTime}` >=
                    `${trip.search.returnDate}T${trip.inbound.departure.time}`
                ) {
                  setError('Обратный трансфер должен быть раньше вылета')
                  return
                }
                setSchedule(draft)
                sessionStorage.setItem('transfer-schedule', JSON.stringify(draft))
                setError('')
                setEditing(false)
              }}
            >
              <h2 className="font-semibold">Дата и время подачи</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="text-sm">
                  Дата поездки в отель
                  <div className="mt-1 flex min-h-11 items-center rounded-xl border border-[#e1e4e8] bg-[#f5f6f7] px-3 text-text-secondary">
                    {formatTransferDate(draft.outboundDate)}
                  </div>
                </div>
                <TransferTimeField
                  label="Время поездки в отель"
                  value={draft.outboundTime}
                  onChange={(value) => setDraft({ ...draft, outboundTime: value })}
                />
                {roundTrip && (
                  <>
                    {trip.inbound ? (
                      <div className="text-sm">
                        Дата обратной поездки
                        <div className="mt-1 flex min-h-11 items-center rounded-xl border border-[#e1e4e8] bg-[#f5f6f7] px-3 text-text-secondary">
                          {formatTransferDate(draft.returnDate)}
                        </div>
                      </div>
                    ) : (
                      <TransferDateField
                        label="Дата обратной поездки"
                        value={draft.returnDate}
                        onChange={(value) => setDraft({ ...draft, returnDate: value })}
                      />
                    )}
                    <TransferTimeField
                      label="Время обратной поездки"
                      value={draft.returnTime}
                      onChange={(value) => setDraft({ ...draft, returnTime: value })}
                    />
                  </>
                )}
              </div>
              {error && (
                <p role="alert" className="text-sm text-red-700">
                  {error}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="h-10 cursor-pointer rounded-xl bg-accent px-4 text-sm font-semibold"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="h-10 cursor-pointer rounded-xl bg-[#e7e9ec] px-4 text-sm font-semibold"
                >
                  Отмена
                </button>
              </div>
            </form>
          )}
          <div aria-label="Варианты трансфера" className="space-y-2">
            {selectionNotice && (
              <p role="status" className="rounded-xl bg-[#fff7d6] p-3 text-sm">
                Выбор трансфера сброшен. Проверьте отель и количество пассажиров.
              </p>
            )}
            {transferOptions.every((option) => option.capacity < trip.passengers) && (
              <p role="status" className="rounded-xl border border-[#e1e4e8] p-4 text-sm">
                Нет автомобиля для такого количества пассажиров.
              </p>
            )}
            {transferOptions.map((option) => (
              <TransferCard
                key={option.id}
                option={option}
                selected={selectedId === option.id}
                roundTrip={roundTrip}
                unavailable={option.capacity < trip.passengers}
                onSelect={() => {
                  setSelectedId(option.id)
                  if (trip.hotel)
                    sessionStorage.setItem(
                      'selected-transfer',
                      JSON.stringify({
                        optionId: option.id,
                        roundTrip,
                        hotelId: trip.hotel.id,
                        flightKey,
                      }),
                    )
                  setSelectionNotice(false)
                }}
              />
            ))}
          </div>
        </div>
        <aside
          ref={summaryRef}
          aria-label="Ваша поездка"
          className="fixed inset-x-0 bottom-0 z-20 max-h-[50dvh] overflow-y-auto border-t border-[#e1e4e8] bg-white p-4 shadow-[0_-6px_20px_rgb(17_17_17_/_8%)] lg:static lg:max-h-none lg:rounded-2xl lg:border lg:shadow-sm"
        >
          <h2 className="hidden text-xl font-semibold lg:block">Ваша поездка</h2>
          <details className="mb-3 lg:hidden">
            <summary className="cursor-pointer text-sm font-semibold">Состав поездки</summary>
            {rows}
          </details>
          <div className="hidden lg:block">{rows}</div>
          <div className="flex items-center justify-between gap-4 lg:mt-4 lg:flex-wrap lg:border-t lg:border-[#e1e4e8] lg:pt-3">
            <div>
              <span className="block text-xs text-text-secondary">Итого</span>
              <strong className="whitespace-nowrap">
                {(trip.rooms.length > 0 && !trip.nights) ||
                (trip.insurance && trip.insurancePrice === null)
                  ? 'Укажите даты'
                  : formatPrice(trip.total + (selected?.price ?? 0) * (roundTrip ? 2 : 1))}
              </strong>
            </div>
            <button
              type="button"
              disabled={!selected || Boolean(trip.insurance && trip.insurancePrice === null)}
              onClick={() => {
                if (
                  !schedule.outboundDate ||
                  !schedule.outboundTime ||
                  (roundTrip &&
                    (!schedule.returnDate ||
                      !schedule.returnTime ||
                      `${schedule.returnDate}T${schedule.returnTime}` <=
                        `${schedule.outboundDate}T${schedule.outboundTime}`))
                ) {
                  setDraft(schedule)
                  setError('Укажите корректные дату и время для каждого направления')
                  setEditing(true)
                  return
                }
                void navigate({ to: '/passengers' })
              }}
              className="h-10 cursor-pointer rounded-xl bg-accent px-5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-[#e7e9ec] disabled:text-text-secondary lg:w-full"
            >
              Продолжить
            </button>
          </div>
        </aside>
      </div>
      <div aria-hidden="true" className="lg:hidden" style={{ height: summaryHeight }} />
    </section>
  )
}

export default TransferPage
