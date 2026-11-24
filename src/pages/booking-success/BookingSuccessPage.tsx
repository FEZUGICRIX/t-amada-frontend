import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import formatPrice from '@/pages/flight-selection/formatPrice'
import { readBooking, STEP_MS, type BookingTrip } from '@/pages/booking-progress/bookingData'
import { readTransferTrip } from '@/pages/transfer/transferTrip'
import BookingTripDetails from '@/pages/booking-progress/BookingTripDetails'

function BookingSuccessPage() {
  const [booking] = useState(readBooking)
  const [openedAt] = useState(Date.now)
  const [showUnavailable, setShowUnavailable] = useState(false)
  if (!booking)
    return (
      <section className="py-10">
        <h1 className="text-2xl font-semibold">Заказ не найден</h1>
        <p className="mt-2 text-text-secondary">
          Вернитесь к проверке поездки, чтобы начать оформление.
        </p>
        <Link
          to="/review"
          className="mt-4 inline-flex rounded-xl bg-accent px-5 py-3 font-semibold"
        >
          К проверке поездки
        </Link>
      </section>
    )
  if (openedAt < booking.startedAt + booking.services.length * STEP_MS)
    return (
      <section className="py-10">
        <h1 className="text-2xl font-semibold">Бронирование ещё не завершено</h1>
        <Link
          to="/booking"
          className="mt-4 inline-flex rounded-xl bg-accent px-5 py-3 font-semibold"
        >
          Посмотреть статус
        </Link>
      </section>
    )
  const currentTrip = readTransferTrip()
  const trip: BookingTrip = booking.trip ?? {
    origin: currentTrip.outbound?.departure.city ?? '',
    destination: currentTrip.outbound?.arrival.city ?? '',
    departureDate: currentTrip.search?.departureDate ?? null,
    returnDate: currentTrip.search?.isOneWay ? null : (currentTrip.search?.returnDate ?? null),
    passengers: currentTrip.passengers,
  }
  const time = (value: number) =>
    new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))
  return (
    <section className="py-6 sm:py-10">
      <header className="flex items-start gap-4 border-b border-[#e1e4e8] pb-6 sm:items-center">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e7f6ec] text-2xl font-semibold text-[#13864c]"
        >
          ✓
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold sm:text-3xl">Поездка забронирована</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Заказ № {booking.startedAt.toString().slice(-6)} · {formatPrice(booking.total)}
          </p>
        </div>
        <p className="hidden shrink-0 text-sm font-semibold sm:block">Все услуги готовы</p>
      </header>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[#e1e4e8] sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:rounded-none sm:border-0">
        {booking.services.map((service) => (
          <div
            key={service.id}
            className="flex min-h-16 items-start justify-between gap-3 border-b border-[#e1e4e8] bg-white px-4 py-4 last:border-b-0 sm:rounded-2xl sm:border sm:p-5"
          >
            <div>
              <h2 className="font-semibold">{service.name}</h2>
              <BookingTripDetails trip={trip} service={service} />
              <p className="mt-1 text-sm text-text-secondary">{formatPrice(service.price)}</p>
            </div>
            <span className="shrink-0 rounded-lg bg-[#e7f6ec] px-3 py-2 text-xs font-semibold text-[#13864c]">
              Готово
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 hidden rounded-2xl border border-[#e1e4e8] p-5 sm:block">
        <h2 className="text-xl font-semibold">История заказа</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center gap-3">
            <span className="w-12 shrink-0 text-text-secondary">{time(booking.startedAt)}</span>
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#188a52]" />
            Заказ создан
          </li>
          <li className="flex items-center gap-3">
            <span className="w-12 shrink-0 text-text-secondary">
              {time(booking.startedAt + booking.services.length * STEP_MS)}
            </span>
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#188a52]" />
            Все услуги подтверждены
          </li>
        </ul>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
        <Link
          to="/"
          className="flex min-h-11 items-center justify-center rounded-xl bg-[#e7e9ec] px-2 sm:px-6 text-sm font-semibold hover:brightness-95"
        >
          На главную
        </Link>
        <button
          type="button"
          onClick={() => setShowUnavailable(true)}
          className="min-h-11 cursor-pointer rounded-xl bg-accent px-2 sm:px-6 text-sm font-semibold hover:brightness-95"
        >
          Открыть поездку
        </button>
      </div>
      {showUnavailable && (
        <p role="status" className="mt-2 text-sm text-text-secondary sm:text-right">
          Раздел поездки пока недоступен.
        </p>
      )}
    </section>
  )
}
export default BookingSuccessPage
