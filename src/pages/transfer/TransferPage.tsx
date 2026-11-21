import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import BookingSteps from '@/shared/BookingSteps'
import {
  FlightPriceRow,
  HotelPriceRow,
  InsurancePriceRow,
  TransferPriceRow,
} from '@/shared/TripPriceRows'
import formatPrice from '@/pages/flight-selection/formatPrice'
import TransferCard from './TransferCard'
import { transferOptions } from './transferOptions'
import { formatTransferDate, readTransferTrip } from './transferTrip'
import TransferDateField from './TransferDateField'
import { clearTransfer, readTransferSelection } from './transferSelection'

function TransferPage() {
  const [trip] = useState(readTransferTrip)
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
  const [continued, setContinued] = useState(false)
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
        return saved
    } catch {
      sessionStorage.removeItem('transfer-schedule')
    }
    return {
      hotelId: trip.hotel?.id,
      outboundFlight: trip.outbound?.id,
      inboundFlight: trip.inbound?.id,
      departureDate: trip.search?.departureDate,
      flightReturnDate: trip.search?.returnDate,
      outboundDate: trip.search?.departureDate ?? '',
      outboundTime: '',
      returnDate: trip.search?.isOneWay ? '' : (trip.search?.returnDate ?? ''),
      returnTime: '',
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
      {trip.room && <HotelPriceRow nightlyPrice={trip.room.price} nights={trip.nights} />}
      {trip.insurance && (
        <InsurancePriceRow price={trip.insurance.price} passengers={trip.passengers} />
      )}
      {selected && <TransferPriceRow price={selected.price} trips={roundTrip ? 2 : 1} />}
    </>
  )
  return (
    <section className="pt-6 pb-40 md:pt-8 md:pb-10 lg:pt-10">
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
          <button
            type="button"
            onClick={() => {
              setSelectedId(null)
              clearTransfer()
              setContinued(true)
            }}
            className="cursor-pointer text-sm font-semibold text-text-secondary underline hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Пропустить этап
          </button>
        </div>
        <p className="mt-2 text-sm text-text-secondary">Из аэропорта до отеля и обратно</p>
        <BookingSteps current={3} />
      </header>
      <div
        role="group"
        aria-label="Направления трансфера"
        className="mt-6 inline-grid max-w-full grid-cols-2 gap-1 rounded-xl bg-[#e7e9ec] p-1"
      >
        {[
          { label: 'Только из аэропорта', value: false },
          { label: 'Из аэропорта и обратно', value: true },
        ].map(({ label, value }) => (
          <button
            key={label}
            type="button"
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
              setContinued(false)
            }}
            className={`min-h-10 cursor-pointer rounded-lg px-3 py-2 text-xs leading-5 focus-visible:outline-2 focus-visible:outline-offset-2 md:text-sm ${roundTrip === value ? 'bg-white font-semibold shadow-sm' : 'hover:bg-white/50'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
        <div className="min-w-0 space-y-3">
          <section
            aria-label="Маршрут трансфера"
            className="flex flex-col items-stretch justify-between gap-3 rounded-xl border border-[#cfd3d8] p-4 md:flex-row md:items-center"
          >
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <h2 className="text-sm font-semibold [overflow-wrap:anywhere]">
                  {airport} → {hotel}
                </h2>
                {trip.hotel && (
                  <p className="mt-1 text-xs text-text-secondary">
                    Адрес отеля: {trip.hotel.address}
                  </p>
                )}
                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  Подача: {formatTransferDate(schedule.outboundDate)}
                  {schedule.outboundTime ? `, ${schedule.outboundTime}` : ', время не выбрано'}
                </p>
              </div>
              {roundTrip && (
                <div className="border-t border-[#e1e4e8] pt-2">
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
                  <p className="mt-1 text-xs leading-5 text-text-secondary">
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
              className="h-9 shrink-0 cursor-pointer self-end rounded-lg px-3 text-sm font-semibold hover:bg-[#f2f3f4] focus-visible:outline-2 md:self-center"
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
                  trip.search?.departureDate &&
                  `${draft.outboundDate}T${draft.outboundTime}` <
                    `${trip.search.departureDate}T${trip.outbound.arrival.time}`
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
                <TransferDateField
                  label="Дата поездки в отель"
                  value={draft.outboundDate}
                  onChange={(value) => setDraft({ ...draft, outboundDate: value })}
                />
                <label className="text-sm">
                  Время поездки в отель
                  <input
                    type="time"
                    value={draft.outboundTime}
                    onChange={(e) => setDraft({ ...draft, outboundTime: e.target.value })}
                    className="mt-1 block h-11 w-full rounded-xl border border-[#cfd3d8] px-3"
                  />
                </label>
                {roundTrip && (
                  <>
                    <TransferDateField
                      label="Дата обратной поездки"
                      value={draft.returnDate}
                      onChange={(value) => setDraft({ ...draft, returnDate: value })}
                    />
                    <label className="text-sm">
                      Время обратной поездки
                      <input
                        type="time"
                        value={draft.returnTime}
                        onChange={(e) => setDraft({ ...draft, returnTime: e.target.value })}
                        className="mt-1 block h-11 w-full rounded-xl border border-[#cfd3d8] px-3"
                      />
                    </label>
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
                  setContinued(false)
                }}
              />
            ))}
          </div>
        </div>
        <aside
          aria-label="Ваша поездка"
          className="fixed inset-x-0 bottom-0 z-20 max-h-[50dvh] overflow-y-auto border-t border-[#e1e4e8] bg-white p-4 shadow-[0_-6px_20px_rgb(17_17_17_/_8%)] md:static md:max-h-none md:rounded-2xl md:border md:shadow-sm"
        >
          <h2 className="hidden text-xl font-semibold md:block">Ваша поездка</h2>
          <details className="mb-3 md:hidden">
            <summary className="cursor-pointer text-sm font-semibold">Состав поездки</summary>
            {rows}
          </details>
          <div className="hidden md:block">{rows}</div>
          <div className="flex items-center justify-between gap-4 md:mt-4 md:border-t md:border-[#e1e4e8] md:pt-3 lg:flex-wrap">
            <div>
              <span className="block text-xs text-text-secondary">Итого</span>
              <strong className="whitespace-nowrap">
                {trip.room && !trip.nights
                  ? 'Укажите даты'
                  : formatPrice(trip.total + (selected?.price ?? 0) * (roundTrip ? 2 : 1))}
              </strong>
            </div>
            <button
              type="button"
              disabled={!selected}
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
                setContinued(true)
              }}
              className="h-10 cursor-pointer rounded-xl bg-accent px-5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-[#e7e9ec] disabled:text-text-secondary lg:w-full"
            >
              Продолжить
            </button>
          </div>
          {continued && (
            <p role="status" className="mt-2 text-sm text-text-secondary">
              Следующий этап пока недоступен.
            </p>
          )}
        </aside>
      </div>
    </section>
  )
}

export default TransferPage
