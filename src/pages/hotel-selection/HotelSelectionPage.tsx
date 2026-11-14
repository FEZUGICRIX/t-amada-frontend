import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { outboundFlights, returnFlights } from '@/pages/flight-selection/mockFlights'
import formatPrice from '@/pages/flight-selection/formatPrice'

function HotelSelectionPage() {
  const [trip] = useState(() => {
    try {
      const search = JSON.parse(sessionStorage.getItem('trip-search') || 'null') as {
        destination: string
        departureDate: string | null
        returnDate: string | null
        isOneWay: boolean
        passengers: { adults: number; children: number; infants: number }
      } | null
      const selected = JSON.parse(sessionStorage.getItem('selected-flights') || 'null') as {
        outbound: string | null
        return: string | null
      } | null
      return { search, selected }
    } catch {
      return { search: null, selected: null }
    }
  })
  const outbound = outboundFlights.find((flight) => flight.id === trip.selected?.outbound)
  const inbound = trip.search?.isOneWay
    ? undefined
    : returnFlights.find((flight) => flight.id === trip.selected?.return)
  const paying = trip.search ? trip.search.passengers.adults + trip.search.passengers.children : 1
  const price = ((outbound?.price ?? 0) + (inbound?.price ?? 0)) * paying
  const date = (value: string | null | undefined) =>
    value
      ? new Date(`${value}T00:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
      : 'дата не выбрана'
  return (
    <section className="pt-6 pb-28 md:pt-8 lg:pt-10">
      <Link
        to="/flights"
        className="mb-4 inline-flex h-10 items-center rounded-xl border border-[#cfd3d8] px-4 text-sm font-semibold hover:bg-[#f5f6f7]"
      >
        Назад
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold md:text-[32px]">Выберите отель</h1>
        <button
          type="button"
          disabled
          title="Следующий этап ещё не готов"
          className="text-sm text-text-secondary disabled:cursor-not-allowed"
        >
          Пропустить этап
        </button>
      </div>
      <p className="mt-2 text-sm text-text-secondary">
        {trip.search?.destination || 'Направление не выбрано'} · {date(trip.search?.departureDate)}{' '}
        {trip.search?.isOneWay ? '' : `- ${date(trip.search?.returnDate)}`} ·{' '}
        {trip.search
          ? trip.search.passengers.adults +
            trip.search.passengers.children +
            trip.search.passengers.infants
          : 0}{' '}
        пассажиров
      </p>
      <ol aria-label="Этапы бронирования" className="mt-4 flex list-none flex-wrap gap-2 p-0">
        {['Авиабилет', 'Отель', 'Страховка', 'Трансфер'].map((step, index) => (
          <li
            key={step}
            aria-current={index === 1 ? 'step' : undefined}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${index === 1 ? 'bg-text-primary text-white' : 'bg-[#e7e9ec] text-text-secondary'}`}
          >
            {index + 1}. {step}
          </li>
        ))}
      </ol>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div>
          <h2 className="text-xl font-semibold">Отели</h2>
          <div className="mt-3 rounded-2xl border border-[#e1e4e8] p-6 text-sm text-text-secondary">
            Список отелей появится в следующей задаче.
          </div>
        </div>
        <aside
          aria-label="Ваша поездка"
          className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e1e4e8] bg-white p-4 shadow-lg lg:static lg:rounded-2xl lg:border lg:shadow-sm"
        >
          <h2 className="hidden text-xl font-semibold lg:block">Ваша поездка</h2>
          <div className="flex items-center justify-between gap-4 lg:mt-4">
            <span className="text-sm">Авиабилет</span>
            <strong>{formatPrice(price)}</strong>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#e1e4e8] pt-3">
            <strong>Итого</strong>
            <strong>{formatPrice(price)}</strong>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default HotelSelectionPage
