import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { outboundFlights, returnFlights } from '@/pages/flight-selection/mockFlights'
import formatPrice from '@/pages/flight-selection/formatPrice'
import HotelCard from './HotelCard'
import { hotels, type Hotel } from './hotels'
import BookingSteps from '@/shared/BookingSteps'

function HotelSelectionPage() {
  const [visibleCount, setVisibleCount] = useState(3)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = loaderRef.current
    if (!element || visibleCount >= hotels.length || typeof IntersectionObserver === 'undefined')
      return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleCount((count) => Math.min(count + 3, hotels.length))
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [visibleCount])
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
    <section className="pt-6 pb-28 md:pt-8 lg:pt-10 lg:pb-10">
      <Link
        to="/flights"
        className="mb-4 inline-flex h-10 items-center rounded-xl border border-[#cfd3d8] px-4 text-sm font-semibold hover:bg-[#f5f6f7]"
      >
        Назад
      </Link>
      <div className="rounded-2xl bg-[radial-gradient(circle_at_90%_0%,rgb(255_221_45_/_22%),transparent_42%),linear-gradient(120deg,#fffdf8,#fff9e4)] p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[22px] leading-7 font-semibold md:text-[28px] md:leading-9 lg:text-[34px] lg:leading-10">
            Выберите отель
          </h1>
          <button
            type="button"
            disabled
            title="Следующий этап ещё не готов"
            className="text-sm text-text-secondary disabled:cursor-not-allowed"
          >
            Пропустить этап
          </button>
        </div>
        <p className="mt-1.5 text-[13px] leading-5 text-text-secondary md:mt-2 md:text-sm">
          {trip.search?.destination || 'Направление не выбрано'} ·{' '}
          {date(trip.search?.departureDate)}{' '}
          {trip.search?.isOneWay ? '' : `- ${date(trip.search?.returnDate)}`} ·{' '}
          {trip.search
            ? trip.search.passengers.adults +
              trip.search.passengers.children +
              trip.search.passengers.infants
            : 0}{' '}
          пассажиров
        </p>
        <BookingSteps current={1} />
      </div>
      <div className="mt-3 grid gap-8 lg:mt-4 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
        <div>
          <h2 className="text-xl leading-7 font-semibold md:text-[22px] md:leading-8">
            {hotels.length} отеля
          </h2>
          <div className="mt-3 flex flex-col gap-2" aria-label="Список отелей">
            {hotels.slice(0, visibleCount).map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                selected={selectedHotel?.id === hotel.id}
                onSelect={setSelectedHotel}
              />
            ))}
          </div>
          {visibleCount < hotels.length && (
            <div ref={loaderRef} className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 3)}
                className="h-10 rounded-xl border border-[#cfd3d8] px-5 text-sm font-semibold hover:bg-[#f5f6f7] focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Показать ещё
              </button>
            </div>
          )}
        </div>
        <aside
          aria-label="Ваша поездка"
          className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e1e4e8] bg-white p-4 shadow-[0_-6px_20px_rgb(17_17_17_/_8%)] lg:static lg:rounded-2xl lg:border lg:p-4 lg:shadow-[0_6px_20px_rgb(17_17_17_/_6%)]"
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
