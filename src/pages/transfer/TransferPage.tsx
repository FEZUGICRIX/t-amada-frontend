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

function TransferPage() {
  const [trip] = useState(readTransferTrip)
  const [roundTrip, setRoundTrip] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [continued, setContinued] = useState(false)
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
                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  Прилёт: {formatTransferDate(trip.search?.departureDate)}
                  {trip.outbound ? `, ${trip.outbound.arrival.time}` : ''}
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
                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                    Обратный вылет:{' '}
                    {formatTransferDate(trip.search?.isOneWay ? null : trip.search?.returnDate)}
                    {trip.inbound ? `, ${trip.inbound.departure.time}` : ''}
                  </p>
                </div>
              )}
            </div>
            <button
              type="button"
              disabled
              title="Изменение параметров пока недоступно"
              className="h-9 shrink-0 cursor-not-allowed self-end rounded-lg px-3 text-sm font-semibold text-text-secondary disabled:opacity-60 md:self-center"
            >
              Изменить
            </button>
          </section>
          <div aria-label="Варианты трансфера" className="space-y-2">
            {transferOptions.map((option) => (
              <TransferCard
                key={option.id}
                option={option}
                selected={selectedId === option.id}
                roundTrip={roundTrip}
                onSelect={() => {
                  setSelectedId(option.id)
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
              onClick={() => setContinued(true)}
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
