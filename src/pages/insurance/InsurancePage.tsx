import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import BookingSteps from '@/shared/BookingSteps'
import formatPrice from '@/pages/flight-selection/formatPrice'
import { getTripFlightPrice } from '@/pages/hotel-selection/tripFlightPrice'
import { hotels } from '@/pages/hotel-selection/hotels'
import { getRoomsForHotel } from '@/pages/hotel-selection/rooms'

function InsurancePage() {
  const [trip] = useState(() => {
    try {
      const selection = JSON.parse(sessionStorage.getItem('selected-room') || 'null') as {
        hotelId: string
        roomId: string
      } | null
      const hotel = hotels.find((item) => item.id === selection?.hotelId)
      const room = hotel
        ? getRoomsForHotel(hotel.price).find((item) => item.id === selection?.roomId)
        : undefined
      return { hotel, room, flightPrice: getTripFlightPrice() }
    } catch {
      return { hotel: undefined, room: undefined, flightPrice: 0 }
    }
  })
  const total = trip.flightPrice + (trip.room?.price ?? 0)
  return (
    <section className="pt-6 pb-28 md:pt-8 lg:pt-10 lg:pb-10">
      {trip.hotel && trip.room ? (
        <Link
          to="/hotels/$hotelId/rooms"
          params={{ hotelId: trip.hotel.id }}
          className="mb-4 inline-flex h-10 items-center rounded-xl border border-[#cfd3d8] px-4 text-sm font-semibold text-text-primary no-underline hover:bg-[#f5f6f7]"
        >
          Назад
        </Link>
      ) : (
        <Link
          to="/hotels"
          className="mb-4 inline-flex h-10 items-center rounded-xl border border-[#cfd3d8] px-4 text-sm font-semibold text-text-primary no-underline hover:bg-[#f5f6f7]"
        >
          Назад
        </Link>
      )}
      <header className="rounded-2xl bg-[radial-gradient(circle_at_90%_0%,rgb(255_221_45_/_22%),transparent_42%),linear-gradient(120deg,#fffdf8,#fff9e4)] p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[22px] leading-7 font-semibold md:text-[28px] md:leading-9 lg:text-[34px] lg:leading-10">
            Выберите страховку
          </h1>
          <button
            type="button"
            disabled
            className="text-sm text-text-secondary disabled:cursor-not-allowed"
          >
            Пропустить этап
          </button>
        </div>
        <p className="mt-2 text-sm text-text-secondary">Стоимость указана за всех пассажиров</p>
        <BookingSteps current={2} />
      </header>
      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
        <div aria-label="Варианты страховки" className="space-y-2">
          {['Базовая защита', 'Расширенная защита'].map((name) => (
            <article
              key={name}
              className="flex items-center gap-4 rounded-xl border border-[#e1e4e8] bg-white p-4"
            >
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#f2f3f4] font-semibold"
              >
                С
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold">{name}</h2>
              </div>
            </article>
          ))}
        </div>
        <aside
          aria-label="Ваша поездка"
          className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e1e4e8] bg-white p-4 shadow-[0_-6px_20px_rgb(17_17_17_/_8%)] lg:static lg:rounded-2xl lg:border lg:shadow-sm"
        >
          <h2 className="hidden text-xl font-semibold lg:block">Ваша поездка</h2>
          {trip.hotel && trip.room && (
            <p className="hidden text-sm text-text-secondary lg:mt-3 lg:block">
              {trip.hotel.name} · {trip.room.name}
            </p>
          )}
          <div className="mt-3 hidden justify-between text-sm lg:flex">
            <span>Авиабилет</span>
            <strong>{formatPrice(trip.flightPrice)}</strong>
          </div>
          {trip.room && (
            <div className="mt-2 hidden justify-between text-sm lg:flex">
              <span>Отель</span>
              <strong>{formatPrice(trip.room.price)}</strong>
            </div>
          )}
          <div className="flex items-center justify-between gap-4 lg:mt-3 lg:border-t lg:border-[#e1e4e8] lg:pt-3">
            <div>
              <span className="block text-xs text-text-secondary">Итого</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <button
              type="button"
              disabled
              className="h-10 rounded-xl bg-[#e7e9ec] px-5 text-sm font-semibold text-text-secondary disabled:cursor-not-allowed"
            >
              Продолжить
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}
export default InsurancePage
